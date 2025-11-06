import express from 'express';
import Election from '../models/Election.js';
import Vote from '../models/Vote.js';
import { getProvider, getElectionContract } from '../config/blockchain.js';

const router = express.Router();

// GET /api/elections - List all elections with filters
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    const now = new Date();
    
    let query = {};
    if (status === 'active') {
      query = { startTime: { $lte: now }, endTime: { $gte: now }, isClosed: false };
    } else if (status === 'upcoming') {
      query = { startTime: { $gt: now } };
    } else if (status === 'ended') {
      query = { $or: [{ endTime: { $lt: now } }, { isClosed: true }] };
    }
    
    const elections = await Election.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));
    
    res.json({ elections, count: elections.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/elections/:address - Get election details
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    let election = await Election.findOne({ address: address.toLowerCase() });
    
    // If not in DB, try to fetch from blockchain
    if (!election) {
      const provider = getProvider();
      const contract = getElectionContract(address, provider);
      const [meta, isClosed, candidatesCount] = await Promise.all([
        contract.meta(),
        contract.isClosed(),
        contract.candidatesCount(),
      ]);
      
      const cNum = Number(candidatesCount);
      const candidates = [];
      for (let i = 0; i < cNum; i++) {
        const c = await contract.getCandidate(i);
        candidates.push({
          id: String(c.id),
          name: c.name,
          metadataUrl: c.metadataUrl,
          voteCount: Number(c.voteCount),
        });
      }
      
      election = {
        address: address.toLowerCase(),
        title: meta.title,
        description: meta.description,
        startTime: new Date(Number(meta.startTime) * 1000),
        endTime: new Date(Number(meta.endTime) * 1000),
        isClosed: Boolean(isClosed),
        candidates,
        totalVotes: candidates.reduce((a, c) => a + c.voteCount, 0),
      };
    }
    
    // Get vote stats
    const voteStats = await Vote.aggregate([
      { $match: { electionAddress: address.toLowerCase() } },
      { $group: { _id: '$candidateId', count: { $sum: 1 } } },
    ]);
    
    res.json({ election, voteStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/elections/:address/candidates - Get candidates with vote counts
router.get('/:address/candidates', async (req, res) => {
  try {
    const { address } = req.params;
    const election = await Election.findOne({ address: address.toLowerCase() });
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    res.json({ candidates: election.candidates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/elections/:address/stats - Get election statistics
router.get('/:address/stats', async (req, res) => {
  try {
    const { address } = req.params;
    const election = await Election.findOne({ address: address.toLowerCase() });
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    
    const totalVotes = await Vote.countDocuments({ electionAddress: address.toLowerCase() });
    const uniqueVoters = await Vote.distinct('voter', { electionAddress: address.toLowerCase() });
    
    const candidateStats = await Vote.aggregate([
      { $match: { electionAddress: address.toLowerCase() } },
      { $group: { _id: '$candidateId', votes: { $sum: 1 } } },
    ]);
    
    res.json({
      totalVotes,
      totalVoters: uniqueVoters.length,
      candidateStats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

