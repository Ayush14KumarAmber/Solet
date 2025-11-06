#!/bin/bash

echo "🚀 Solet Full Stack Deployment"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
  echo -e "${YELLOW}⚠️  backend/.env not found${NC}"
  echo "Creating from .env.example..."
  cp backend/.env.example backend/.env
  echo -e "${RED}Please edit backend/.env with your configuration${NC}"
  exit 1
fi

if [ ! -f "frontend/.env" ]; then
  echo -e "${YELLOW}⚠️  frontend/.env not found${NC}"
  echo "Creating template..."
  echo "VITE_API_URL=http://localhost:3000/api" > frontend/.env
  echo "VITE_FACTORY_ADDRESS=" >> frontend/.env
  echo "VITE_RPC_URL=" >> frontend/.env
  echo -e "${RED}Please edit frontend/.env with your configuration${NC}"
  exit 1
fi

echo "1️⃣  Deploying Smart Contracts to Sepolia..."
echo ""
cd backend
npm install > /dev/null 2>&1

# Check if Hardhat is configured
if [ ! -f "hardhat.config.js" ]; then
  echo -e "${YELLOW}⚠️  Hardhat config not found in backend${NC}"
  echo "Copying from root..."
  cp ../hardhat.config.js .
fi

npm run deploy:sepolia
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Contract deployment failed${NC}"
  exit 1
fi

# Extract factory address
FACTORY_ADDRESS=$(node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync('../deployments/addresses.json'));console.log(d.sepolia?.VotingFactory||'')")
echo -e "${GREEN}✅ Contracts deployed${NC}"
echo "Factory Address: $FACTORY_ADDRESS"
cd ..

echo ""
echo "2️⃣  Building Frontend..."
cd frontend
npm install > /dev/null 2>&1
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Frontend build failed${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Frontend built${NC}"
cd ..

echo ""
echo "3️⃣  Deployment Options:"
echo ""
echo "Backend:"
echo "  - Railway: railway up (from backend/)"
echo "  - Render: Connect GitHub repo"
echo "  - Heroku: git push heroku main"
echo ""
echo "Frontend:"
echo "  - Vercel: vercel --prod (from frontend/)"
echo "  - Netlify: netlify deploy --prod (from frontend/)"
echo ""
echo -e "${GREEN}✅ Ready for deployment!${NC}"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with FACTORY_ADDRESS=$FACTORY_ADDRESS"
echo "2. Deploy backend to Railway/Render/Heroku"
echo "3. Update frontend/.env with backend URL"
echo "4. Deploy frontend to Vercel/Netlify"

