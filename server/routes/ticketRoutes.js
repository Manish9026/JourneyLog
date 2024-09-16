import express from 'express'
import { authMiddleWare } from '../middlewares/auth.js';
import { bookTicket } from '../controllers/ticketController.js';
const router =express.Router();

router.post("/book",authMiddleWare,bookTicket)
export default router