import express from 'express';
import { placeOrder } from '../controllers/placeorder.controller.js';

const router = express.Router();

 
router.post('/purchase', placeOrder);

export default router;
