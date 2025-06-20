 

import Notification from '../models/notification.model.js';

export const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const notifications = await Notification.find({ recipientUserId: userId })
      .sort({ createdAt: -1 });  

    return res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications
    });

  } catch (err) {
    console.error('Error fetching notifications:', err);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};
