import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/auth.js';

const router = express.Router();

router.post('/forgotPassword', forgotPassword);
// TODO : PATCH ou PUT ?
router.patch('/resetPassword/:token', resetPassword);

export default router;