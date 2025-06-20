import Earning from '../models/earning.model.js';
import User from '../models/user.model.js';
import Transaction from '../models/transaction.model.js';

 
export const getEarningsReport = async (req, res) => {
  try {
    const { userId } = req.params;

     
    const earnings = await Earning.find({ userId })
      .populate('sourceUserId', 'name email referralCode')
      .populate('transactionId', 'amount createdAt')
      .sort({ createdAt: -1 });

    if (!earnings.length) {
      return res.status(200).json({
        message: 'No earnings found for this user',
        totalEarnings: 0,
        level1Earnings: 0,
        level2Earnings: 0,
        earnings: []
      });
    }

    
    let totalEarnings = 0;
    let level1Earnings = 0;
    let level2Earnings = 0;

    earnings.forEach(entry => {
      totalEarnings += entry.profitAmount;
      if (entry.level === 1) level1Earnings += entry.profitAmount;
      if (entry.level === 2) level2Earnings += entry.profitAmount;
    });

    return res.status(200).json({
      message: 'Earnings fetched successfully',
      totalEarnings,
      level1Earnings,
      level2Earnings,
      earnings  
    });

  } catch (err) {
    console.error('Earnings report error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
