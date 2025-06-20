import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  referralCode: {
    type: String,
    required: true,
    unique: true
  },

  
  referredBy: {
    type: String,
    default: null
  },

   
  directReferrals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

 
const User = mongoose.model('User', userSchema);
export default User;
