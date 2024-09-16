import express from 'express'
import { Auth } from '../controllers/authController.js';
import { authMiddleWare } from '../middlewares/auth.js';
const router=express.Router();


router.post('/login',Auth.login);
router.post('/register',Auth.register);
router.get('/verify',authMiddleWare,Auth.verify)
router.get('/logout',Auth.logout)


export default router