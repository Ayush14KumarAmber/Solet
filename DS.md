# 🚀 Quick Deployment Summary

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] MetaMask wallet with Sepolia ETH
- [ ] MongoDB Atlas account (free)
- [ ] Vercel/Netlify account (free)
- [ ] Railway/Render account (free)

## Step-by-Step Deployment

### 1. Deploy Smart Contracts (5 min)

```bash
# Configure .env
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_key

# Deploy
npm run deploy:sepolia

# Save the Factory address from deployments/addresses.json
```

### 2. Set Up MongoDB Atlas (3 min)

1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Save it: `mongodb+srv://user:pass@cluster.mongodb.net/solet`

### 3. Deploy Backend (10 min)

**Option A: Railway (Easiest)**
```bash
cd backend
npm i -g @railway/cli
railway login
railway init
railway variables set MONGODB_URI=your_mongo_uri
railway variables set RPC_URL=your_rpc_url
railway variables set FACTORY_ADDRESS=0xYourFactory
railway up
```

**Option B: Render**
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### 4. Sync Blockchain Data (2 min)

```bash
# SSH into backend or use Railway CLI
railway run npm run sync
```

### 5. Deploy Frontend (5 min)

**Option A: Vercel**
```bash
cd frontend
npm i -g vercel
vercel

# Set environment variables in Vercel dashboard:
# VITE_API_URL=https://your-backend-url/api
# VITE_FACTORY_ADDRESS=0xYourFactory
# VITE_RPC_URL=your_rpc_url

vercel --prod
```

**Option B: Netlify**
```bash
cd frontend
npm i -g netlify-cli
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

## Automated Deployment

Run the interactive script:
```bash
./deploy-step-by-step.sh
```

## Post-Deployment

1. **Test Backend**: `curl https://your-backend-url/health`
2. **Test Frontend**: Open deployed URL
3. **Connect MetaMask**: Switch to Sepolia network
4. **Test Voting**: Create election and vote

## Environment Variables Reference

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb+srv://...
RPC_URL=https://sepolia.infura.io/v3/...
FACTORY_ADDRESS=0x...
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url/api
VITE_FACTORY_ADDRESS=0x...
VITE_RPC_URL=https://sepolia.infura.io/v3/...
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MongoDB connection |
| No elections showing | Run `npm run sync` in backend |
| Frontend blank | Verify `VITE_API_URL` is correct |
| Vote fails | Check MetaMask network (Sepolia) |

## Production URLs

Update these after deployment:
- Frontend: `https://solet.vercel.app`
- Backend: `https://solet-backend.railway.app`
- Factory: `https://sepolia.etherscan.io/address/0x...`

## Support

See [DEPLOY.md](./DEPLOY.md) for detailed instructions.
