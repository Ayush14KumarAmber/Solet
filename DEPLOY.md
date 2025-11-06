# 🚀 Solet Deployment Guide

Complete deployment guide for smart contracts, backend, and frontend.

## Prerequisites

- Node.js 18+
- MetaMask wallet with testnet ETH (for contract deployment)
- MongoDB Atlas account (free tier works)
- Vercel/Netlify account (for frontend)
- Railway/Render account (for backend, or use free tier)

## 1. Smart Contract Deployment (Sepolia Testnet)

### Step 1: Configure Environment

Create `backend/.env`:
```env
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_deployer_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Step 2: Deploy Contracts

```bash
cd backend
npm install
npm run deploy:sepolia
```

This will:
- Deploy VotingFactory
- Create a sample election
- Save addresses to `deployments/addresses.json`
- Verify contracts on Etherscan

### Step 3: Verify on Etherscan

```bash
npm run verify
```

**Save the Factory address** - you'll need it for backend/frontend config.

## 2. Backend Deployment

### Option A: Railway (Recommended - Free Tier)

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize Project:**
   ```bash
   cd backend
   railway init
   ```

3. **Set Environment Variables:**
   ```bash
   railway variables set MONGODB_URI=your_mongodb_atlas_uri
   railway variables set RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
   railway variables set FACTORY_ADDRESS=0xYourFactoryAddress
   railway variables set PORT=3000
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

### Option B: Render

1. **Create New Web Service** on Render
2. **Connect GitHub repo** or deploy from CLI
3. **Set Environment Variables:**
   - `MONGODB_URI`
   - `RPC_URL`
   - `FACTORY_ADDRESS`
   - `PORT=3000`

4. **Build Command:** `npm install`
5. **Start Command:** `npm start`

### Option C: Heroku

```bash
cd backend
heroku create solet-backend
heroku addons:create mongolab:sandbox
heroku config:set RPC_URL=...
heroku config:set FACTORY_ADDRESS=...
git push heroku main
```

### After Backend Deployment

1. **Get your backend URL** (e.g., `https://solet-backend.railway.app`)
2. **Sync blockchain data:**
   ```bash
   # SSH into your backend or use Railway CLI
   railway run npm run sync
   ```

## 3. Frontend Deployment

### Option A: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `VITE_API_URL=https://your-backend-url/api`
   - `VITE_FACTORY_ADDRESS=0xYourFactoryAddress`
   - `VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY`

4. **Redeploy** after setting env vars:
   ```bash
   vercel --prod
   ```

### Option B: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   cd frontend
   netlify deploy --prod
   ```

3. **Set Environment Variables** in Netlify dashboard:
   - `VITE_API_URL`
   - `VITE_FACTORY_ADDRESS`
   - `VITE_RPC_URL`

### Option C: GitHub Pages

See `deploy-gh-pages.sh` script.

## 4. MongoDB Atlas Setup

1. **Create Account:** https://www.mongodb.com/cloud/atlas
2. **Create Cluster** (Free M0 tier)
3. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
4. **Add to Backend Environment:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solet
   ```

## 5. Event Listener Setup

For continuous blockchain event syncing, set up a worker:

### Railway Worker

1. Create new service → "Empty Service"
2. Set environment variables
3. **Start Command:** `node services/eventListener.js listen`
4. Deploy

### Render Cron Job

Use Render's cron job feature or a separate worker service.

## 6. Post-Deployment Checklist

- [ ] Contracts deployed and verified on Etherscan
- [ ] Backend API accessible (test `/health` endpoint)
- [ ] MongoDB connected and synced
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] MetaMask connects successfully
- [ ] Elections load from backend
- [ ] Voting works end-to-end

## 7. Testing Production

1. **Test Backend:**
   ```bash
   curl https://your-backend-url/health
   curl https://your-backend-url/api/elections
   ```

2. **Test Frontend:**
   - Open deployed URL
   - Connect MetaMask (Sepolia network)
   - Browse elections
   - Submit a test vote

## Troubleshooting

- **Backend 500 errors:** Check MongoDB connection and RPC URL
- **Frontend blank:** Verify `VITE_API_URL` is set correctly
- **No elections:** Run sync command on backend
- **Vote fails:** Check MetaMask network (must be Sepolia)

## Production URLs Template

Update these in your documentation:

- **Frontend:** https://solet.vercel.app
- **Backend:** https://solet-backend.railway.app
- **Factory Contract:** https://sepolia.etherscan.io/address/0x...
- **MongoDB:** MongoDB Atlas Cluster

