# Solet - Decentralized Voting dApp

A complete full-stack decentralized voting platform built with Solidity, React, Node.js, and MongoDB.

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │ (React + Vite + TypeScript)
│  (Vercel)   │
└──────┬──────┘
       │ HTTP
┌──────▼──────┐
│   Backend   │ (Express + MongoDB)
│  (Railway)  │
└──────┬──────┘
       │ Web3
┌──────▼──────┐
│  Contracts  │ (Solidity + Hardhat)
│  (Sepolia)  │
└─────────────┘
```

## ✨ Features

- **Smart Contracts**: VotingFactory and Election contracts with multiple voting modes
- **Frontend**: Modern React app with Tailwind CSS and shadcn/ui components
- **Backend API**: RESTful API with MongoDB for indexing and caching
- **Event Sync**: Automatic blockchain event listener for real-time updates
- **Wallet Integration**: MetaMask connection for voting
- **Voting Modes**: Open, Allowlist, and Token-gated voting

## 🚀 Quick Start

### Local Development

```bash
# Start all services
./start.sh

# Or manually:
# Terminal 1: Backend
cd backend && npm install && npm start

# Terminal 2: Sync data
cd backend && npm run sync

# Terminal 3: Frontend
cd frontend && npm install && npm run dev
```

### Deployment

See [DEPLOY.md](./DEPLOY.md) for complete deployment guide.

**Quick Deploy:**
```bash
./deploy-step-by-step.sh
```

## 📁 Project Structure

```
Solet/
├── contracts/          # Solidity smart contracts
│   ├── VotingFactory.sol
│   ├── Election.sol
│   └── libraries/
├── tests/             # Hardhat tests
├── scripts/           # Deployment scripts
├── backend/           # Express API server
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   └── services/      # Event listener
└── frontend/          # React frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── lib/
    └── dist/
```

## 🔧 Configuration

### Smart Contracts

Create `.env` in root:
```env
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### Backend

Create `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/solet
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
FACTORY_ADDRESS=0xYourFactoryAddress
```

### Frontend

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_FACTORY_ADDRESS=0xYourFactoryAddress
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

## 📚 Documentation

- [DEPLOY.md](./DEPLOY.md) - Complete deployment guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - Setup verification

## 🧪 Testing

```bash
# Smart contracts
npm run test
npm run coverage

# Backend (add tests)
cd backend && npm test

# Frontend (add tests)
cd frontend && npm test
```

## 🔗 Links

- **Frontend**: http://localhost:5173 (dev) or your deployed URL
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚠️ Security

- Never commit `.env` files
- Use environment variables for secrets
- Review smart contract code before deployment
- Test thoroughly on testnets before mainnet
