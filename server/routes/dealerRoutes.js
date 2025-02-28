import express from 'express'
const router=express.Router();
import {authMiddleWare} from '../middlewares/auth.js'
import { Dealer } from '../controllers/dealerController.js';
router.post("/addDealer",authMiddleWare,Dealer.addNewDealer);


export default router;