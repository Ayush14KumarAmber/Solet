#!/bin/bash

# Script to push Solet project to GitHub

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Pushing Solet to GitHub${NC}"
echo "=============================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
fi

# Check for .env files that shouldn't be committed
if git ls-files | grep -q "\.env$"; then
  echo -e "${RED}⚠️  WARNING: .env files are tracked!${NC}"
  echo "Removing from git (they'll stay locally)..."
  git rm --cached .env backend/.env frontend/.env 2>/dev/null || true
fi

# Add all files
echo "Adding files to git..."
git add .

# Check status
echo ""
echo "Files to be committed:"
git status --short

echo ""
read -p "Continue with commit? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

# Commit
echo ""
echo "Creating commit..."
git commit -m "Initial commit: Solet voting dApp

- Smart contracts (VotingFactory, Election)
- Backend API (Express + MongoDB)
- Frontend (React + Vite + TypeScript)
- Tests and deployment scripts"

# Check if remote exists
if git remote | grep -q "origin"; then
  echo ""
  echo "Remote 'origin' already exists."
  read -p "Do you want to update it? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter GitHub repository URL: " REPO_URL
    git remote set-url origin "$REPO_URL"
  fi
else
  echo ""
  read -p "Enter GitHub repository URL (e.g., https://github.com/username/solet.git): " REPO_URL
  git remote add origin "$REPO_URL"
fi

# Push
echo ""
echo -e "${GREEN}Pushing to GitHub...${NC}"
git branch -M main
git push -u origin main

echo ""
echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
echo ""
echo "Repository URL: $REPO_URL"

