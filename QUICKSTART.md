# Solet Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- MetaMask browser extension (for voting)

## Setup Steps

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/solet
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
FACTORY_ADDRESS=0xYourFactoryAddress
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000/api
VITE_FACTORY_ADDRESS=0xYourFactoryAddress
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### 3. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env
```

### 4. Run the Application

**Option A: Use the startup script**
```bash
./start.sh
```

**Option B: Manual start**

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Sync blockchain data:
```bash
cd backend
npm run sync
```

Terminal 3 - Frontend:
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Health check: http://localhost:3000/health

## Testing the Connection

1. **Check Backend**: Visit http://localhost:3000/health
2. **Check API**: Visit http://localhost:3000/api/elections
3. **Check Frontend**: Open http://localhost:5173 in your browser
4. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection

## Troubleshooting

- **MongoDB not running**: Start MongoDB service
- **Backend errors**: Check `backend/.env` configuration
- **Frontend blank**: Ensure backend is running and `VITE_API_URL` is set
- **No elections**: Run `npm run sync` in backend to sync blockchain data

## Next Steps

- Deploy contracts to Sepolia testnet
- Update `.env` files with deployed contract addresses
- Run event listener: `cd backend && node services/eventListener.js listen`

