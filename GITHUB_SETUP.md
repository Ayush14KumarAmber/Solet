# 📦 Push Solet to GitHub

## Quick Method (Automated)

Run the script:
```bash
./push-to-github.sh
```

This will:
1. Check for sensitive files (.env)
2. Add all files
3. Create initial commit
4. Set up GitHub remote
5. Push to GitHub

## Manual Method

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `solet` (or your choice)
3. Description: "Decentralized voting dApp"
4. Choose Public or Private
5. **Don't** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 2: Push to GitHub

```bash
# Make sure sensitive files aren't tracked
git rm --cached .env backend/.env frontend/.env 2>/dev/null || true

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Solet voting dApp

- Smart contracts (VotingFactory, Election)
- Backend API (Express + MongoDB)  
- Frontend (React + Vite + TypeScript)
- Tests and deployment scripts"

# Add GitHub remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/solet.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## What Gets Pushed

✅ **Included:**
- All source code (contracts, backend, frontend)
- Configuration files
- Documentation
- Scripts
- Tests

❌ **Excluded** (via .gitignore):
- `.env` files (sensitive credentials)
- `node_modules/`
- `dist/` and `build/`
- `deployments/` (contract addresses)
- `coverage/`
- IDE files

## After Pushing

### 1. Set Up GitHub Secrets (for CI/CD)

If you want automated deployments, add secrets in GitHub:
- Settings → Secrets and variables → Actions
- Add: `RPC_URL`, `PRIVATE_KEY`, `ETHERSCAN_API_KEY`, etc.

### 2. Enable GitHub Pages (Optional)

For frontend documentation:
- Settings → Pages
- Source: `main` branch, `/docs` folder

### 3. Add Repository Topics

Help others find your project:
- Topics: `blockchain`, `voting`, `dapp`, `solidity`, `react`, `web3`

### 4. Create Releases

Tag important versions:
```bash
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

## Repository Structure on GitHub

```
solet/
├── .gitignore
├── README.md
├── DEPLOY.md
├── contracts/
├── backend/
├── frontend/
├── tests/
└── scripts/
```

## Security Checklist

Before pushing, ensure:
- [ ] No `.env` files are committed
- [ ] No private keys in code
- [ ] No hardcoded API keys
- [ ] `.gitignore` is up to date
- [ ] Sensitive data is in environment variables only

## Troubleshooting

**"Repository not found"**
- Check repository URL
- Verify you have push access
- Try: `git remote -v` to check remote URL

**"Permission denied"**
- Use HTTPS with personal access token
- Or set up SSH keys: https://docs.github.com/en/authentication

**"Large files"**
- GitHub has 100MB file limit
- Use Git LFS for large files if needed

## Next Steps

After pushing:
1. Share the repository link
2. Set up CI/CD (GitHub Actions)
3. Connect to deployment platforms (Vercel, Railway)
4. Add collaborators if needed

