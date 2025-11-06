import { getProvider, getFactoryContract, getElectionContract } from '../config/blockchain.js';
import Election from '../models/Election.js';
import Vote from '../models/Vote.js';
import { connectDB } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function syncElections() {
  try {
    await connectDB();
    const provider = getProvider();
    const factory = getFactoryContract(provider);
    
    const count = Number(await factory.getElectionsCount());
    console.log(`📊 Found ${count} elections on-chain`);
    
    for (let i = 0; i < count; i++) {
      const address = await factory.elections(i);
      await syncElection(address, provider);
    }
    
    console.log('✅ Sync complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync error:', error);
    process.exit(1);
  }
}

async function syncElection(address, provider) {
  try {
    const contract = getElectionContract(address, provider);
    const [meta, isClosed, candidatesCount, votingMode] = await Promise.all([
      contract.meta(),
      contract.isClosed(),
      contract.candidatesCount(),
      contract.votingMode(),
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
    
    const totalVotes = candidates.reduce((a, c) => a + c.voteCount, 0);
    
    await Election.findOneAndUpdate(
      { address: address.toLowerCase() },
      {
        address: address.toLowerCase(),
        electionId: 0, // Will be set from event
        creator: '', // Will be set from event
        title: meta.title,
        description: meta.description,
        startTime: new Date(Number(meta.startTime) * 1000),
        endTime: new Date(Number(meta.endTime) * 1000),
        votingMode: Number(votingMode),
        isClosed: Boolean(isClosed),
        candidates,
        totalVotes,
        lastSynced: new Date(),
      },
      { upsert: true }
    );
    
    console.log(`✅ Synced election: ${meta.title}`);
  } catch (error) {
    console.error(`❌ Error syncing ${address}:`, error.message);
  }
}

async function listenToEvents() {
  try {
    await connectDB();
    const provider = getProvider();
    const factory = getFactoryContract(provider);
    
    console.log('👂 Listening to ElectionCreated events...');
    
    factory.on('ElectionCreated', async (electionAddress, electionId, creator) => {
      console.log(`🆕 New election created: ${electionAddress}`);
      await syncElection(electionAddress, provider);
      
      // Update with creator and electionId from event
      await Election.findOneAndUpdate(
        { address: electionAddress.toLowerCase() },
        { creator: creator.toLowerCase(), electionId: Number(electionId) }
      );
    });
    
    // Also listen to VoteCast events on all known elections
    const elections = await Election.find({ isClosed: false });
    for (const e of elections) {
      const contract = getElectionContract(e.address, provider);
      contract.on('VoteCast', async (voter, candidateId, timestamp, log) => {
        console.log(`🗳️ Vote cast: ${voter} -> candidate ${candidateId} in ${e.address}`);
        
        // Get transaction details
        const tx = await provider.getTransaction(log.transactionHash);
        const receipt = await provider.getTransactionReceipt(log.transactionHash);
        
        // Check if vote already recorded
        const existing = await Vote.findOne({ txHash: log.transactionHash });
        if (!existing) {
          const vote = new Vote({
            electionAddress: e.address.toLowerCase(),
            voter: voter.toLowerCase(),
            candidateId: Number(candidateId),
            txHash: log.transactionHash,
            blockNumber: receipt.blockNumber,
            timestamp: new Date(Number(timestamp) * 1000),
          });
          await vote.save();
          
          // Reload election to get fresh data
          const updated = await Election.findOne({ address: e.address.toLowerCase() });
          if (updated) {
            const candidate = updated.candidates.find(c => String(c.id) === String(candidateId));
            if (candidate) {
              candidate.voteCount += 1;
              updated.totalVotes += 1;
              await updated.save();
            }
          }
        }
      });
    }
    
    console.log('✅ Event listeners active');
  } catch (error) {
    console.error('❌ Event listener error:', error);
    process.exit(1);
  }
}

// Run sync or listen based on command
const mode = process.argv[2] || 'sync';
if (mode === 'listen') {
  listenToEvents();
} else {
  syncElections();
}

