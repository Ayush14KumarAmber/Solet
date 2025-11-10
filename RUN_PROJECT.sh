#!/bin/bash

echo "🚀 Starting Solet Project"
echo "========================"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing root dependencies..."
  npm install
fi

if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd backend
  npm install
  cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..
fi

# Check for .env files
if [ ! -f "backend/.env" ]; then
  echo "⚠️  Backend .env not found!"
  echo "Creating template..."
  cat > backend/.env << EOL
PORT=3000
MONGODB_URI=mongodb://localhost:27017/solet
RPC_URL=https://rpc.sepolia.org
FACTORY_ADDRESS=
EOL
  echo "✅ Created backend/.env - Please edit with your values"
fi

if [ ! -f "frontend/.env" ]; then
  echo "⚠️  Frontend .env not found!"
  echo "Creating template..."
  cat > frontend/.env << EOL
VITE_API_URL=http://localhost:3000/api
VITE_FACTORY_ADDRESS=
VITE_RPC_URL=https://rpc.sepolia.org
EOL
  echo "✅ Created frontend/.env"
fi

echo ""
echo "✅ Dependencies installed"
echo ""
echo "📡 Starting backend..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

sleep 3

echo "🎨 Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services started!"
echo ""
echo "📡 Backend: http://localhost:3000"
echo "🎨 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
