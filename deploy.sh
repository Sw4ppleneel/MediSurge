#!/bin/bash
# deploy.sh - Simple deployment script

echo "🚀 Deploying Surge Planner API..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create data directory
mkdir -p data

# Build and start the services
echo "📦 Building Docker image..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if the API is healthy
echo "🏥 Checking API health..."
if curl -f http://localhost:8000/ &> /dev/null; then
    echo "✅ API is running successfully!"
    echo "📖 API Documentation: http://localhost:8000/docs"
    echo "🔍 Health Check: http://localhost:8000/"
    echo "📋 View logs: docker-compose logs -f"
    echo "🛑 Stop services: docker-compose down"
else
    echo "❌ API failed to start. Check logs with: docker-compose logs"
    exit 1
fi
