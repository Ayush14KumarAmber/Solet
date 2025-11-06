#!/bin/bash

# Solet Step-by-Step Deployment Script
# This script guides you through deploying the entire stack

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Solet Deployment Wizard${NC}"
echo "=============================="
echo ""

# Step 1: Smart Contracts
echo -e "${YELLOW}Step 1: Deploy Smart Contracts to Sepolia${NC}"
echo ""
read -p "Have you configured .env with RPC_URL, PRIVATE_KEY, and ETHERSCAN_API_KEY? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Please configure .env first:"
  echo "  RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY"
  echo "  PRIVATE_KEY=your_private_key"
  echo "  ETHERSCAN_API_KEY=your_etherscan_key"
  exit 1
fi

echo "Deploying contracts..."
npm run deploy:sepolia

FACTORY_ADDRESS=$(node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync('deployments/addresses.json'));console.log(d.sepolia?.VotingFactory||'NOT_FOUND')")

if [ "$FACTORY_ADDRESS" = "NOT_FOUND" ]; then
  echo -e "${YELLOW}⚠️  Could not find factory address. Please check deployments/addresses.json${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Contracts deployed!${NC}"
echo "Factory Address: $FACTORY_ADDRESS"
echo ""

# Step 2: MongoDB
echo -e "${YELLOW}Step 2: Set up MongoDB Atlas${NC}"
echo ""
echo "1. Go to https://www.mongodb.com/cloud/atlas"
echo "2. Create a free cluster"
echo "3. Get your connection string"
echo ""
read -p "Enter your MongoDB connection string: " MONGODB_URI

# Step 3: Backend
echo ""
echo -e "${YELLOW}Step 3: Deploy Backend${NC}"
echo ""
echo "Choose deployment platform:"
echo "1. Railway (Recommended - Free tier)"
echo "2. Render (Free tier)"
echo "3. Heroku (Paid)"
echo "4. Skip (deploy manually)"
read -p "Enter choice (1-4): " backend_choice

case $backend_choice in
  1)
    echo "Setting up Railway..."
    cd backend
    if ! command -v railway &> /dev/null; then
      echo "Installing Railway CLI..."
      npm i -g @railway/cli
    fi
    railway login
    railway init
    railway variables set MONGODB_URI="$MONGODB_URI"
    railway variables set RPC_URL="$RPC_URL"
    railway variables set FACTORY_ADDRESS="$FACTORY_ADDRESS"
    railway variables set PORT=3000
    railway up
    BACKEND_URL=$(railway domain)
    echo -e "${GREEN}✅ Backend deployed to: $BACKEND_URL${NC}"
    cd ..
    ;;
  2)
    echo "Please deploy to Render manually:"
    echo "1. Create new Web Service"
    echo "2. Connect GitHub repo"
    echo "3. Set environment variables:"
    echo "   MONGODB_URI=$MONGODB_URI"
    echo "   RPC_URL=$RPC_URL"
    echo "   FACTORY_ADDRESS=$FACTORY_ADDRESS"
    echo "   PORT=3000"
    read -p "Enter your Render backend URL: " BACKEND_URL
    ;;
  3)
    echo "Please deploy to Heroku manually"
    read -p "Enter your Heroku backend URL: " BACKEND_URL
    ;;
  4)
    read -p "Enter your backend URL (or press Enter to skip): " BACKEND_URL
    ;;
esac

# Step 4: Frontend
echo ""
echo -e "${YELLOW}Step 4: Deploy Frontend${NC}"
echo ""
echo "Choose deployment platform:"
echo "1. Vercel (Recommended)"
echo "2. Netlify"
echo "3. Skip (deploy manually)"
read -p "Enter choice (1-3): " frontend_choice

case $frontend_choice in
  1)
    cd frontend
    if ! command -v vercel &> /dev/null; then
      echo "Installing Vercel CLI..."
      npm i -g vercel
    fi
    
    # Create .env.production
    echo "VITE_API_URL=$BACKEND_URL/api" > .env.production
    echo "VITE_FACTORY_ADDRESS=$FACTORY_ADDRESS" >> .env.production
    echo "VITE_RPC_URL=$RPC_URL" >> .env.production
    
    vercel --prod
    FRONTEND_URL=$(vercel ls | grep solet-frontend | head -1 | awk '{print $2}')
    echo -e "${GREEN}✅ Frontend deployed to: $FRONTEND_URL${NC}"
    cd ..
    ;;
  2)
    cd frontend
    if ! command -v netlify &> /dev/null; then
      echo "Installing Netlify CLI..."
      npm i -g netlify-cli
    fi
    
    # Create .env.production
    echo "VITE_API_URL=$BACKEND_URL/api" > .env.production
    echo "VITE_FACTORY_ADDRESS=$FACTORY_ADDRESS" >> .env.production
    echo "VITE_RPC_URL=$RPC_URL" >> .env.production
    
    netlify deploy --prod
    echo -e "${GREEN}✅ Frontend deployed!${NC}"
    cd ..
    ;;
  3)
    echo "Please deploy frontend manually"
    echo "Set these environment variables:"
    echo "  VITE_API_URL=$BACKEND_URL/api"
    echo "  VITE_FACTORY_ADDRESS=$FACTORY_ADDRESS"
    echo "  VITE_RPC_URL=$RPC_URL"
    ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "Summary:"
echo "  Factory Address: $FACTORY_ADDRESS"
echo "  Backend URL: $BACKEND_URL"
echo "  Frontend URL: $FRONTEND_URL"
echo ""
echo "Next steps:"
echo "1. Sync blockchain data: ssh into backend and run 'npm run sync'"
echo "2. Test the deployed application"
echo "3. Set up event listener for continuous syncing"

