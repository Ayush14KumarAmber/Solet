import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true, index: true },
  votesCount: { type: Number, default: 0 },
  lastVoteAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('User', userSchema);

