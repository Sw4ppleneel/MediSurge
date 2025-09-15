"""
Vercel entry point for Surge Planner API
"""
import os
import sys

# Add the parent directory to the path so we can import from the root
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from vercel_app import app
    # This is what Vercel will call
    handler = app
except Exception as e:
    print(f"Error importing app: {e}")
    # Fallback simple FastAPI app
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/")
    def health():
        return {"status": "error", "message": f"Import failed: {str(e)}"}
    
    handler = app
