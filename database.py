# database.py - Database setup and models
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database URL - you can change this to PostgreSQL, MySQL, etc.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./surge_planner.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# User model for storing user information
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    hospital_name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

# Plan model for storing surge plans
class SurgePlan(Base):
    __tablename__ = "surge_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)  # Foreign key to users table
    location = Column(String(255), nullable=False)
    inventory_data = Column(Text, nullable=True)  # JSON string of inventory
    plan_data = Column(Text, nullable=False)  # JSON string of generated plan
    briefing = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create all tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Database dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
