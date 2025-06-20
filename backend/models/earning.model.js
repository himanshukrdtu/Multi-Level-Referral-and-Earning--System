import mongoose from 'mongoose';

const earningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true
  },

  sourceUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true
  },

  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },

  level: {
    type: Number,
    enum: [1, 2],  
    required: true
  },

  percent: {
    type: Number,
    required: true  
  },

  profitAmount: {
    type: Number,
    required: true  
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Earning = mongoose.model('Earning', earningSchema);
export default Earning;
