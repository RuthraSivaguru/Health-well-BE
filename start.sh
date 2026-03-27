#!/bin/bash

# Function to stop containers on exit
cleanup() {
  echo "Stopping docker containers..."
  docker-compose down
}

# Trap EXIT signal (happens on script finish or interruption)
trap cleanup EXIT

# Free port 3000 if already in use
echo "Freeing port 3000..."
lsof -ti tcp:3000 | xargs kill -9 2>/dev/null || true
pkill -9 -f "nest start" 2>/dev/null || true

# Start Docker containers in the background
echo "Starting database..."
docker-compose up -d

# Wait a moment for DB to initialize (optional, but good practice)
echo "Waiting for database..."
sleep 2

# Create database if it doesn't exist
echo "Ensuring database exists..."
node createDatabase.js

# Start the NestJS application
echo "Starting application..."
pnpm start:dev
