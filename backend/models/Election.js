import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  metadataUrl: { type: String, default: '' },
  voteCount: { type: Number, default: 0 },
}, { _id: false });

const electionSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true, index: true },
  electionId: { type: Number, required: true },
  creator: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  votingMode: { type: Number, default: 0 }, // 0=Open, 1=Allowlist, 2=TokenGated
  tokenAddress: { type: String, default: null },
  minTokenBalance: { type: String, default: '0' },
  isClosed: { type: Boolean, default: false },
  candidates: [candidateSchema],
  totalVotes: { type: Number, default: 0 },
  totalVoters: { type: Number, default: 0 },
  lastSynced: { type: Date, default: Date.now },
}, { timestamps: true });

electionSchema.index({ startTime: 1, endTime: 1 });
electionSchema.index({ isClosed: 1 });

export default mongoose.model('Election', electionSchema);

