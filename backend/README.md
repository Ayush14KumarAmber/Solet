# Solet Backend API

Node.js + Express + MongoDB backend for the Solet voting dApp. Syncs with on-chain smart contracts and provides REST APIs for the frontend.

## Features

- RESTful API for elections, votes, and admin stats
- MongoDB models for Election, Vote, User
- Blockchain event listener to sync on-chain data
- Automatic vote tracking and statistics
- CORS enabled for frontend integration

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/solet
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
FACTORY_ADDRESS=0xYourFactoryAddress
```

### 3. Start MongoDB

Make sure MongoDB is running:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### 4. Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will start on `http://localhost:3000`

## API Endpoints

### Elections

- `GET /api/elections` - List all elections (query: `?status=active|upcoming|ended&limit=50&offset=0`)
- `GET /api/elections/:address` - Get election details
- `GET /api/elections/:address/candidates` - Get candidates
- `GET /api/elections/:address/stats` - Get statistics

### Votes

- `GET /api/votes/:address` - Get votes for an election
- `GET /api/votes/:address/:voter` - Check if voter has voted
- `POST /api/votes` - Record a vote (internal, called by event listener)

### Admin

- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/elections` - All elections
- `GET /api/admin/users` - User statistics

## Syncing Blockchain Data

### One-time Sync

Sync all elections from blockchain to MongoDB:

```bash
npm run sync
```

### Continuous Event Listening

Listen to new events and sync automatically:

```bash
node services/eventListener.js listen
```

This will:
- Listen for `ElectionCreated` events
- Listen for `VoteCast` events on all active elections
- Update MongoDB in real-time

## Frontend Integration

Update your frontend to use the backend API:

```javascript
// Example: Fetch elections
const response = await fetch('http://localhost:3000/api/elections?status=active');
const { elections } = await response.json();
```

## Database Models

### Election
- `address` - Contract address (unique)
- `title`, `description` - Metadata
- `startTime`, `endTime` - Voting window
- `candidates` - Array of candidates with vote counts
- `totalVotes`, `totalVoters` - Statistics

### Vote
- `electionAddress` - Election contract address
- `voter` - Voter address
- `candidateId` - Selected candidate
- `txHash` - Transaction hash (unique)
- `blockNumber`, `timestamp` - Block info

### User
- `address` - Wallet address (unique)
- `votesCount` - Total votes cast
- `lastVoteAt` - Last vote timestamp

## Development

- Uses ES modules (`type: "module"`)
- Express with CORS enabled
- Mongoose for MongoDB
- Ethers.js for blockchain interaction

## License

MIT

