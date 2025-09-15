#!/bin/bash
# start_production.sh - Start the API in production mode

echo "🚀 Starting Surge Planner API in Production Mode..."

# Set environment variables
export ENVIRONMENT=production
export HOST=0.0.0.0
export PORT=8000
export DATABASE_URL=sqlite:///./data/surge_planner.db

# Create data directory if it doesn't exist
mkdir -p data

# Start the application
python3 app.py
