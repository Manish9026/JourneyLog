import express from 'express'
import { payment } from '../controllers/paymentController.js';
import {authMiddleWare} from '../middlewares/auth.js'
export const paymentRoute=express.Router();

paymentRoute.post("/add",authMiddleWare, payment.addPayment);
paymentRoute.get("/recent",authMiddleWare,payment.recentPayment)