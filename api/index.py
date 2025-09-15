"""
Vercel entry point for Surge Planner API
"""
import os
import sys

# Add the parent directory to the path so we can import from the root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from vercel_app import app

# This is what Vercel will call
handler = app
