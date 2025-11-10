# 🚀 Getting Started - Solet dApp

Complete step-by-step guide to make your project work.

## 📋 Prerequisites

Before starting, make sure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB installed (or MongoDB Atlas account)
- [ ] MetaMask browser extension (for voting)
- [ ] Git (optional, for version control)

## 🔧 Step 1: Install Dependencies

### Install Root Dependencies (Smart Contracts)

```bash
cd /Users/ayushkumar/Desktop/Solet
npm install
```

### Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

**Or install all at once:**
```bash
npm install && cd backend && npm install && cd ../frontend && npm install && cd ..
```

## 🗄️ Step 2: Set Up MongoDB

### Option A: Local MongoDB

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect successfully
```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0)
4. Create database user
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/solet`

## ⚙️ Step 3: Configure Environment Variables

### Backend Configuration

Create `backend/.env`:
```bash
cd backend
cp .env.example .env  # If .env.example exists
# Or create .env manually
```

Edit `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/solet
# Or for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solet

RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
# Or use Alchemy:
# RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

FACTORY_ADDRESS=
# Leave empty if contracts not deployed yet
```

**Get RPC URL:**
- Infura: https://infura.io (free tier)
- Alchemy: https://alchemy.com (free tier)
- Or use public RPC: `https://rpc.sepolia.org`

### Frontend Configuration

Create `frontend/.env`:
```bash
cd frontend
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_FACTORY_ADDRESS=
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

**Note:** If `VITE_API_URL` is not set, frontend will use mock data.

## 🏗️ Step 4: Compile Smart Contracts (Optional)

If you want to test contracts locally:

```bash
# From root directory
npm run compile
```

## 🚀 Step 5: Start the Application

### Option A: Use Startup Script (Easiest)

```bash
./start.sh
```

This will:
- Start MongoDB (if local)
- Start backend server
- Sync blockchain data
- Start frontend dev server

### Option B: Manual Start (3 Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:3000
📡 API available at http://localhost:3000/api
```

**Terminal 2 - Sync Data (Optional):**
```bash
cd backend
npm run sync
```

This syncs elections from blockchain to MongoDB.

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

## 🌐 Step 6: Access the Application

1. **Open your browser**: http://localhost:5173
2. **Test the API**: http://localhost:3000/health
3. **Test elections endpoint**: http://localhost:3000/api/elections

## 🧪 Step 7: Test the Application

### Test Frontend (Mock Data)

1. Open http://localhost:5173
2. Click "Home" - should show featured elections
3. Click "Elections" - should show all elections
4. Click an election card - should show details
5. Try searching - should filter elections
6. Try tabs - should filter by status

### Test Wallet Connection

1. Install MetaMask browser extension
2. Click "Connect Wallet" button
3. Approve connection in MetaMask
4. Should see your wallet address

### Test Backend API

```bash
# Health check
curl http://localhost:3000/health

# Get elections
curl http://localhost:3000/api/elections

# Get admin stats
curl http://localhost:3000/api/admin/stats
```

## 🔗 Step 8: Connect to Blockchain (Optional)

### Deploy Contracts to Sepolia

1. **Get testnet ETH:**
   - Go to https://sepoliafaucet.com
   - Request testnet ETH

2. **Configure deployment:**
   - Add `PRIVATE_KEY` to root `.env`
   - Add `ETHERSCAN_API_KEY` to root `.env`

3. **Deploy:**
   ```bash
   npm run deploy:sepolia
   ```

4. **Update environment:**
   - Copy factory address from `deployments/addresses.json`
   - Update `backend/.env`: `FACTORY_ADDRESS=0x...`
   - Update `frontend/.env`: `VITE_FACTORY_ADDRESS=0x...`

5. **Sync data:**
   ```bash
   cd backend
   npm run sync
   ```

6. **Restart services:**
   - Restart backend
   - Restart frontend (or just refresh browser)

## 🐛 Troubleshooting

### Backend won't start

**Error: "MongoDB connection error"**
```bash
# Check if MongoDB is running
brew services list  # macOS
# Or
mongosh  # Should connect

# If using Atlas, check connection string
# Make sure password is URL-encoded
```

**Error: "Port 3000 already in use"**
```bash
# Find process using port 3000
lsof -ti:3000
# Kill it
kill -9 $(lsof -ti:3000)
```

### Frontend won't start

**Error: "Port 5173 already in use"**
```bash
# Find process using port 5173
lsof -ti:5173
# Kill it
kill -9 $(lsof -ti:5173)
```

**Error: "Cannot find module"**
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### No elections showing

**If using mock data:**
- Elections should show automatically
- Check browser console for errors

**If using backend:**
```bash
# Check if backend is running
curl http://localhost:3000/health

# Check if data synced
curl http://localhost:3000/api/elections

# Sync data manually
cd backend
npm run sync
```

### Wallet connection fails

**Error: "No provider available"**
- Make sure MetaMask is installed
- Make sure MetaMask is unlocked
- Refresh the page

**Error: "User rejected request"**
- Click "Connect Wallet" again
- Approve connection in MetaMask

## ✅ Verification Checklist

- [ ] All dependencies installed
- [ ] MongoDB running (local or Atlas)
- [ ] Backend `.env` configured
- [ ] Frontend `.env` configured
- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can see elections on home page
- [ ] Can browse elections page
- [ ] Can view election details
- [ ] Wallet connection works (optional)
- [ ] API endpoints respond (optional)

## 🎯 Quick Start (Minimal Setup)

For quick testing with mock data only:

```bash
# 1. Install dependencies
npm install && cd frontend && npm install && cd ..

# 2. Start frontend
cd frontend
npm run dev

# 3. Open browser
# http://localhost:5173
```

This works without backend or blockchain!

## 📚 Next Steps

1. **Test all features** - Browse, search, filter elections
2. **Connect wallet** - Install MetaMask and connect
3. **Deploy contracts** - Deploy to Sepolia testnet
4. **Sync data** - Connect backend to blockchain
5. **Create election** - Use admin page to create elections
6. **Test voting** - Submit votes with MetaMask

## 🆘 Need Help?

- Check `QUICKSTART.md` for quick reference
- Check `DEPLOY.md` for deployment guide
- Check browser console for errors (F12)
- Check backend logs in terminal
- Verify all environment variables are set

## 🎉 Success!

If you can:
- ✅ See the home page with elections
- ✅ Browse the elections page
- ✅ View election details
- ✅ Connect your wallet

**Your project is working! 🚀**

---

**Happy coding!** For more details, see other documentation files in the project.

