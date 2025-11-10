# 👀 How to Preview the Solet dApp

## Quick Preview (Frontend Only)

### Step 1: Start Frontend Dev Server

```bash
cd frontend
npm install  # If you haven't already
npm run dev
```

### Step 2: Open in Browser

The terminal will show:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

**Open your browser and go to:** `http://localhost:5173`

## Full Stack Preview (Frontend + Backend)

### Option 1: Use the Startup Script

```bash
./start.sh
```

This starts:
- MongoDB (if installed locally)
- Backend API server (port 3000)
- Frontend dev server (port 5173)

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

**Terminal 3 - Sync Data (Optional):**
```bash
cd backend
npm run sync
# Syncs blockchain data to MongoDB
```

## What You'll See

### Home Page (`/`)
- Hero section with "Decentralized Governance Made Simple"
- Statistics cards (Total Elections, Active Votes, etc.)
- Featured elections grid
- Connect Wallet button
- Features section

### Elections Page (`/elections`)
- Search bar
- Filter tabs (All, Active, Upcoming, Ended)
- Grid of election cards
- Each card shows:
  - Election title and status
  - Progress bar
  - Vote counts
  - Candidate information

### Election Details Page (`/election/:id`)
- Full election information
- Candidate list with vote percentages
- Voting interface (if election is active)
- Wallet connection sidebar
- Submit vote button

### Admin Page (`/admin`)
- Admin dashboard
- Create election form
- Manage elections table
- Settings panel

## Features to Test

### 1. Wallet Connection
- Click "Connect Wallet" button
- Approve MetaMask connection
- See your wallet address displayed

### 2. Browse Elections
- Navigate to `/elections`
- Use search to filter
- Click on an election card to view details

### 3. View Election Details
- Click "View Details" or "Vote Now"
- See candidate list
- View vote statistics
- See progress bars

### 4. Voting (Requires MetaMask + Testnet)
- Connect wallet
- Select a candidate
- Click "Submit Vote"
- Approve transaction in MetaMask
- See vote confirmation

## Troubleshooting

### "Cannot GET /"
- Make sure you're using Vite dev server, not opening `index.html` directly
- Run `npm run dev` from the `frontend` directory

### "Failed to fetch elections"
- Backend might not be running
- Check `VITE_API_URL` in `frontend/.env`
- Or frontend will use mock data as fallback

### "Network error"
- Check if backend is running on port 3000
- Verify CORS is enabled in backend
- Check browser console for errors

### Blank page
- Check browser console (F12) for errors
- Make sure all dependencies are installed: `npm install`
- Try clearing browser cache

## Mock Data

If backend is not running, the frontend uses mock data:
- 9 sample elections
- Various statuses (active, upcoming, ended)
- Sample vote counts
- Mock candidates

## Production Preview

To see the production build:

```bash
cd frontend
npm run build
npm run preview
# Opens on http://localhost:4173
```

## Mobile Preview

The frontend is responsive! To test on mobile:
1. Start dev server
2. Note the "Network" URL (e.g., `http://192.168.x.x:5173`)
3. Open that URL on your mobile device (same Wi-Fi network)

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- MetaMask extension required for voting

## Next Steps

1. **Connect MetaMask**: Install MetaMask extension
2. **Switch to Sepolia**: Add Sepolia testnet to MetaMask
3. **Get Test ETH**: Request from Sepolia faucet
4. **Test Voting**: Create an election and vote

Enjoy exploring the Solet dApp! 🚀

