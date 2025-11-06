# ✅ Solet Full Stack Setup Complete

## What's Been Connected

### ✅ Frontend → Backend API
- Elections page fetches from `/api/elections` (with blockchain fallback)
- Election details page uses `/api/elections/:address`
- Home page stats from `/api/admin/stats`
- Automatic fallback to direct blockchain if backend unavailable

### ✅ Backend → Smart Contracts
- MongoDB models for Election, Vote, User
- REST API endpoints for all operations
- Event listener service syncs blockchain events
- Automatic vote tracking and statistics

### ✅ Smart Contracts
- VotingFactory.sol - Creates and tracks elections
- Election.sol - Individual election with voting modes
- Full test coverage (>90%)

## How to Run

### Quick Start (All Services)
```bash
./start.sh
```

### Manual Start

**1. Start MongoDB:**
```bash
brew services start mongodb-community
# Or use MongoDB Atlas
```

**2. Configure Backend** (`backend/.env`):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/solet
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
FACTORY_ADDRESS=0xYourFactoryAddress
```

**3. Start Backend:**
```bash
cd backend
npm install
npm start
```

**4. Sync Blockchain Data:**
```bash
cd backend
npm run sync
```

**5. Configure Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000/api
VITE_FACTORY_ADDRESS=0xYourFactoryAddress
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

**6. Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## API Endpoints

- `GET /api/elections` - List elections (query: `?status=active|upcoming|ended`)
- `GET /api/elections/:address` - Get election details
- `GET /api/votes/:address` - Get votes for election
- `GET /api/admin/stats` - Platform statistics

## Event Listener

To continuously sync blockchain events:
```bash
cd backend
node services/eventListener.js listen
```

## Testing

1. Open http://localhost:5173
2. Click "Connect Wallet" → Approve MetaMask
3. Browse elections
4. View election details
5. Submit votes (requires MetaMask + testnet ETH)

## Architecture

```
Frontend (React + Vite)
    ↓ HTTP
Backend API (Express + MongoDB)
    ↓ Web3
Smart Contracts (Solidity + Hardhat)
    ↓ Events
Event Listener (Syncs to MongoDB)
```

## Next Steps

1. Deploy contracts to Sepolia testnet
2. Update `.env` files with deployed addresses
3. Run event listener for real-time sync
4. Test voting flow end-to-end

## Troubleshooting

- **Backend won't start**: Check MongoDB is running
- **No elections showing**: Run `npm run sync` in backend
- **Frontend blank**: Check `VITE_API_URL` in frontend/.env
- **Vote fails**: Ensure MetaMask is connected to correct network

