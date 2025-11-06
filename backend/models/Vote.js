import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  electionAddress: { type: String, required: true, index: true },
  voter: { type: String, required: true, index: true },
  candidateId: { type: Number, required: true },
  txHash: { type: String, required: true, unique: true },
  blockNumber: { type: Number, required: true },
  timestamp: { type: Date, required: true },
}, { timestamps: true });

voteSchema.index({ electionAddress: 1, voter: 1 }, { unique: true });
voteSchema.index({ electionAddress: 1, candidateId: 1 });

export default mongoose.model('Vote', voteSchema);

