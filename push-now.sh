#!/bin/bash

# Quick script to push to GitHub

echo "🚀 Pushing Solet to GitHub"
echo "=========================="
echo ""

# Check if remote exists
if git remote | grep -q "origin"; then
  CURRENT=$(git remote get-url origin)
  echo "Current remote: $CURRENT"
  read -p "Update remote URL? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git remote remove origin
  else
    echo "Pushing to existing remote..."
    git push -u origin main
    exit 0
  fi
fi

# Get GitHub URL
echo ""
echo "Enter your GitHub repository URL"
echo "Example: https://github.com/username/solet.git"
read -p "Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "❌ No URL provided. Exiting."
  exit 1
fi

# Add remote and push
echo ""
echo "Adding remote and pushing..."
git remote add origin "$REPO_URL"
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed to GitHub!"
  echo "Repository: $REPO_URL"
else
  echo ""
  echo "❌ Push failed. Please check:"
  echo "1. Repository URL is correct"
  echo "2. Repository exists on GitHub"
  echo "3. You have push access"
  echo "4. You're authenticated (use personal access token if needed)"
fi

