import express from 'express';
import Election from '../models/Election.js';
import Vote from '../models/Vote.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/admin/stats - Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalElections, activeElections, totalVotes, totalUsers] = await Promise.all([
      Election.countDocuments(),
      Election.countDocuments({ isClosed: false, endTime: { $gte: new Date() } }),
      Vote.countDocuments(),
      User.countDocuments(),
    ]);
    
    res.json({
      totalElections,
      activeElections,
      totalVotes,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/elections - Get all elections for admin
router.get('/elections', async (req, res) => {
  try {
    const elections = await Election.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ elections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/users - Get user statistics
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ votesCount: -1 })
      .limit(50);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

