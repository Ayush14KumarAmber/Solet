import express from 'express';
import Vote from '../models/Vote.js';
import Election from '../models/Election.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/votes/:address - Get votes for an election
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const votes = await Vote.find({ electionAddress: address.toLowerCase() })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json({ votes, count: votes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/votes/:address/:voter - Check if voter has voted
router.get('/:address/:voter', async (req, res) => {
  try {
    const { address, voter } = req.params;
    const vote = await Vote.findOne({
      electionAddress: address.toLowerCase(),
      voter: voter.toLowerCase(),
    });
    res.json({ hasVoted: !!vote, vote: vote || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/votes - Record a vote (called by event listener, not directly by users)
router.post('/', async (req, res) => {
  try {
    const { electionAddress, voter, candidateId, txHash, blockNumber, timestamp } = req.body;
    
    // Check if vote already exists
    const existing = await Vote.findOne({ txHash });
    if (existing) {
      return res.status(409).json({ error: 'Vote already recorded' });
    }
    
    const vote = new Vote({
      electionAddress: electionAddress.toLowerCase(),
      voter: voter.toLowerCase(),
      candidateId: Number(candidateId),
      txHash,
      blockNumber: Number(blockNumber),
      timestamp: new Date(timestamp * 1000),
    });
    await vote.save();
    
    // Update election candidate vote count
    const election = await Election.findOne({ address: electionAddress.toLowerCase() });
    if (election) {
      const candidate = election.candidates.find(c => String(c.id) === String(candidateId));
      if (candidate) {
        candidate.voteCount += 1;
        election.totalVotes += 1;
        await election.save();
      }
    }
    
    // Update user stats
    await User.findOneAndUpdate(
      { address: voter.toLowerCase() },
      { $inc: { votesCount: 1 }, $set: { lastVoteAt: new Date() } },
      { upsert: true }
    );
    
    res.status(201).json({ vote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

