import express from 'express';
import { getEarningsReport } from '../controllers/earning.controller.js';

const router = express.Router();

 
router.get('/:userId', getEarningsReport);

export default router;
