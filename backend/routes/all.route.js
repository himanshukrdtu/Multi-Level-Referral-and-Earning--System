import express from 'express';
import authRoutes from './auth.route.js';
import transactionRoutes from './transaction.route.js';
import earningsRoutes from './earning.route.js';
import notificationRoutes from './notification.route.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transaction', transactionRoutes);
router.use('/earnings', earningsRoutes);
router.use('/notifications', notificationRoutes);

export default router;
