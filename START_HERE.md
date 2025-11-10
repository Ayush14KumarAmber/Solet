# 🎯 START HERE - Make Project Working

Follow these steps in order to get your project running.

## ✅ Step-by-Step Checklist

### 1. Install Dependencies (5 minutes)

```bash
# Go to project directory
cd /Users/ayushkumar/Desktop/Solet

# Install root dependencies (contracts)
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

**Check:** All `node_modules` folders should exist.

---

### 2. Set Up MongoDB (5 minutes)

**Choose one option:**

#### Option A: Local MongoDB
```bash
# Install MongoDB (if not installed)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Test connection
mongosh
# Type: exit
```

#### Option B: MongoDB Atlas (Cloud - Easier)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0)
4. Create database user
5. Get connection string
6. Copy the connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/solet`)

---

### 3. Create Environment Files (2 minutes)

#### Backend Environment

Create `backend/.env`:
```bash
cd backend
nano .env
# Or use any text editor
```

Paste this (replace with your values):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/solet
# OR for Atlas: mongodb+srv://user:pass@cluster.mongodb.net/solet

RPC_URL=https://rpc.sepolia.org
# OR: https://sepolia.infura.io/v3/YOUR_KEY

FACTORY_ADDRESS=
# Leave empty for now
```

Save and exit.

#### Frontend Environment

Create `frontend/.env`:
```bash
cd ../frontend
nano .env
```

Paste this:
```env
VITE_API_URL=http://localhost:3000/api
VITE_FACTORY_ADDRESS=
VITE_RPC_URL=https://rpc.sepolia.org
```

Save and exit.

---

### 4. Start Backend Server (1 minute)

**Open Terminal 1:**
```bash
cd /Users/ayushkumar/Desktop/Solet/backend
npm start
```

**Wait for:**
```
✅ MongoDB connected
🚀 Server running on http://localhost:3000
```

**If you see errors:**
- MongoDB not running? Start it: `brew services start mongodb-community`
- Port 3000 in use? Kill it: `kill -9 $(lsof -ti:3000)`

---

### 5. Start Frontend Server (1 minute)

**Open Terminal 2:**
```bash
cd /Users/ayushkumar/Desktop/Solet/frontend
npm run dev
```

**Wait for:**
```
➜  Local:   http://localhost:5173/
```

---

### 6. Open in Browser (10 seconds)

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the Solet home page!

---

## 🎉 Success!

If you can see the website, **your project is working!**

## 🧪 Test It

1. **Home Page** - Should show featured elections
2. **Elections Page** - Click "Elections" in navigation
3. **Search** - Try searching for "Treasury"
4. **Filters** - Click "Active" tab
5. **Details** - Click any election card
6. **Wallet** - Click "Connect Wallet" (requires MetaMask)

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check if MongoDB is running: `brew services list`
- Check connection string in `backend/.env`
- For Atlas: Make sure IP is whitelisted (0.0.0.0/0)

### "Port 3000 already in use"
```bash
kill -9 $(lsof -ti:3000)
```

### "Port 5173 already in use"
```bash
kill -9 $(lsof -ti:5173)
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "No elections showing"
- Check if backend is running
- Check browser console (F12) for errors
- Frontend will use mock data if backend is down

## 📝 Quick Commands Reference

```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm run dev

# Kill processes
kill -9 $(lsof -ti:3000)  # Backend
kill -9 $(lsof -ti:5173)  # Frontend

# Check if running
curl http://localhost:3000/health  # Backend
curl http://localhost:5173          # Frontend
```

## 🚀 Next Steps

Once working:
1. Connect MetaMask wallet
2. Deploy contracts to Sepolia
3. Sync blockchain data
4. Test voting functionality

## 📚 More Help

- **Detailed guide**: See `GETTING_STARTED.md`
- **Quick reference**: See `QUICK_START.md`
- **Deployment**: See `DEPLOY.md`
- **Troubleshooting**: Check browser console (F12)

---

**You're all set! Happy coding! 🎉**

