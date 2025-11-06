#!/bin/bash

echo "🚀 Starting Solet Full Stack Application"
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
  echo "⚠️  MongoDB is not running. Starting MongoDB..."
  if command -v brew &> /dev/null; then
    brew services start mongodb-community 2>/dev/null || echo "Please start MongoDB manually"
  else
    echo "Please start MongoDB manually: mongod"
  fi
  sleep 2
fi

# Start backend
echo "📡 Starting backend server..."
cd backend
if [ ! -f .env ]; then
  echo "⚠️  No .env file found. Creating from .env.example..."
  cp .env.example .env
  echo "Please edit backend/.env with your configuration"
fi
npm install > /dev/null 2>&1
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Sync blockchain data
echo "🔄 Syncing blockchain data..."
cd backend
npm run sync &
SYNC_PID=$!
cd ..

# Wait for sync
sleep 5

# Start frontend
echo "🎨 Starting frontend..."
cd frontend
if [ ! -f .env ]; then
  echo "⚠️  No .env file found. Creating from template..."
  echo "VITE_API_URL=http://localhost:3000/api" > .env
  echo "VITE_FACTORY_ADDRESS=" >> .env
  echo "VITE_RPC_URL=" >> .env
fi
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ All services started!"
echo ""
echo "📡 Backend API: http://localhost:3000"
echo "🎨 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "kill $BACKEND_PID $SYNC_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait

