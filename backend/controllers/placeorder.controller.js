import User from '../models/user.model.js';
import Transaction from '../models/transaction.model.js';
import Earning from '../models/earning.model.js';
import Notification from '../models/notification.model.js';
import { io, onlineUsers } from '../index.js';

export const placeOrder = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ message: 'userId and amount are required' });
    }
 
    const transaction = await Transaction.create({ userId, amount });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (amount < 1000) {
      return res.status(200).json({
        message: 'Purchase successful, but no referral profit since amount < ₹1000',
        transaction
      });
    }

    
    if (!user.referredBy) {
      return res.status(200).json({
        message: 'Purchase successful, no referral code used → no profit distributed',
        transaction
      });
    }

    
    const level1 = await User.findOne({ referralCode: user.referredBy });

    if (level1) {
      const level1Profit = amount * 0.05;

      await Earning.create({
        userId: level1._id,
        sourceUserId: user._id,
        transactionId: transaction._id,
        level: 1,
        percent: 0.05,
        profitAmount: level1Profit
      });

      const message1 = `🎉 You earned ₹${level1Profit.toFixed(2)} (5%) from a level 1 referral's purchase of ₹${amount}.`;
      const notif1 = await Notification.create({
        recipientUserId: level1._id,
        message: message1,
        transactionId: transaction._id
      });

      const socket1 = onlineUsers.get(level1._id.toString());
      if (socket1) {
        io.to(socket1).emit('new-notification', notif1);
      }
    }

    
    if (level1?.referredBy) {
      const level2 = await User.findOne({ referralCode: level1.referredBy });

      if (level2) {
        const level2Profit = amount * 0.01;

        await Earning.create({
          userId: level2._id,
          sourceUserId: user._id,
          transactionId: transaction._id,
          level: 2,
          percent: 0.01,
          profitAmount: level2Profit
        });

        const message2 = `🎉 You earned ₹${level2Profit.toFixed(2)} (1%) from a level 2 referral's purchase of ₹${amount}.`;
        const notif2 = await Notification.create({
          recipientUserId: level2._id,
          message: message2,
          transactionId: transaction._id
        });

        const socket2 = onlineUsers.get(level2._id.toString());
        if (socket2) {
          io.to(socket2).emit('new-notification', notif2);
        }
      }
    }

    return res.status(200).json({
      message: 'Purchase successful, referral profit distributed (if eligible)',
      transaction
    });

  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
