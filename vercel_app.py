# vercel_app.py - Vercel-compatible FastAPI app
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import json
import sys
import os

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from surge_planner import build_multiplier_plan, apply_multipliers, make_human_nlg
from database import get_db, create_tables, User, SurgePlan
from auth import hash_password, verify_password, create_access_token, verify_token

app = FastAPI(title="Surge Planner API")
security = HTTPBearer()

# CORS (configured for Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables
try:
    create_tables()
except Exception as e:
    print(f"Database initialization warning: {e}")

# Pydantic models for request/response
from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    hospitalName: str
    location: str = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PlanRequest(BaseModel):
    location: str
    inventory: str
    baselines: dict = {}

# Auth dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.email == payload["email"]).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@app.get("/")
def health():
    return {"status": "healthy", "service": "Surge Planner API", "platform": "Vercel"}

# Authentication endpoints
@app.post("/auth/signup")
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        hospital_name=user_data.hospitalName,
        location=user_data.location
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": new_user.email,
            "hospital_name": new_user.hospital_name,
            "location": new_user.location
        }
    }

@app.post("/auth/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "hospital_name": user.hospital_name,
            "location": user.location
        }
    }

@app.get("/auth/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "hospital_name": current_user.hospital_name,
        "location": current_user.location,
        "created_at": current_user.created_at,
        "last_login": current_user.last_login
    }

@app.post("/plan")
def create_plan(plan_request: PlanRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Build the plan using your existing logic
        payload = {
            "location": plan_request.location,
            "inventory": plan_request.inventory,
            "baselines": plan_request.baselines
        }
        
        plan, features, env_blocks = build_multiplier_plan(
            payload,
            cap=2.0,
            ai_events=True,
            ai_min_conf=0.6,
            ai_model="gpt-4o-mini",
        )
        translated = apply_multipliers(plan, payload.get("baselines", {}))
        briefing = make_human_nlg(plan, features, env_blocks, translated, model="gpt-4o-mini")
        
        # Save the plan to database
        surge_plan = SurgePlan(
            user_id=current_user.id,
            location=plan_request.location,
            inventory_data=plan_request.inventory,
            plan_data=json.dumps(translated),
            briefing=briefing
        )
        
        db.add(surge_plan)
        db.commit()
        db.refresh(surge_plan)
        
        return {
            "id": surge_plan.id,
            "translated": translated, 
            "briefing": briefing,
            "created_at": surge_plan.created_at
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating plan: {str(e)}"
        )

@app.get("/plans")
def get_user_plans(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all plans for the current user"""
    plans = db.query(SurgePlan).filter(SurgePlan.user_id == current_user.id).order_by(SurgePlan.created_at.desc()).all()
    
    return [
        {
            "id": plan.id,
            "location": plan.location,
            "briefing": plan.briefing,
            "created_at": plan.created_at
        }
        for plan in plans
    ]

@app.get("/plans/{plan_id}")
def get_plan(plan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get a specific plan by ID"""
    plan = db.query(SurgePlan).filter(
        SurgePlan.id == plan_id,
        SurgePlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    
    return {
        "id": plan.id,
        "location": plan.location,
        "inventory_data": plan.inventory_data,
        "translated": json.loads(plan.plan_data),
        "briefing": plan.briefing,
        "created_at": plan.created_at
    }
