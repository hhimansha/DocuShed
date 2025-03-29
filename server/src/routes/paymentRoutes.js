import express from 'express';
import { initiatePayment, handleWebhook, getAllPayments, getPaymentById, getUserPayments, getDoctorPayments } from '../controllers/paymentController.js';

import userAuth from '../Middleware/userAutj.js';

const router = express.Router();

router.post('/initiate', initiatePayment);
router.post('/webhook', handleWebhook);

router.get('/', userAuth, getAllPayments);
router.get('/:id', userAuth, getPaymentById);
router.get('/user/:userId', userAuth, getUserPayments);
router.get('/doctor/:doctorId', userAuth, getDoctorPayments);

export default router;
