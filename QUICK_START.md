# ⚡ Quick Start - Get Running in 5 Minutes

## Minimal Setup (Frontend Only - Mock Data)

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Frontend
```bash
npm run dev
```

### Step 3: Open Browser
```
http://localhost:5173
```

**Done!** You can now explore the UI with mock data.

---

## Full Setup (Frontend + Backend)

### Step 1: Install All Dependencies
```bash
# Root (contracts)
npm install

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Step 2: Set Up MongoDB

**Option A: Local**
```bash
brew services start mongodb-community
```

**Option B: Atlas (Cloud)**
1. Create free account at https://mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string

### Step 3: Configure Environment

**Backend (`backend/.env`):**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/solet
RPC_URL=https://rpc.sepolia.org
FACTORY_ADDRESS=
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:3000/api
VITE_FACTORY_ADDRESS=
VITE_RPC_URL=https://rpc.sepolia.org
```

### Step 4: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Open Browser
```
http://localhost:5173
```

**Done!** Full stack is running.

---

## One-Command Start

```bash
./start.sh
```

This starts everything automatically!

---

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
kill -9 $(lsof -ti:3000)

# Kill process on port 5173
kill -9 $(lsof -ti:5173)
```

**Dependencies not found?**
```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install
```

**MongoDB not running?**
```bash
# Start MongoDB
brew services start mongodb-community

# Or use Atlas (cloud)
```

---

## What You'll See

1. **Home Page** - Featured elections and stats
2. **Elections Page** - Browse all elections
3. **Election Details** - View and vote
4. **Admin Page** - Create elections

---

**That's it! Your dApp is running! 🎉**

