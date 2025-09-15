#!/usr/bin/env python3
# start_server.py - Script to start the API server with database initialization

import uvicorn
from database import create_tables

if __name__ == "__main__":
    # Create database tables
    print("Creating database tables...")
    create_tables()
    print("Database tables created successfully!")
    
    # Start the server
    print("Starting API server on http://localhost:8000")
    uvicorn.run(
        "api.plan:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
