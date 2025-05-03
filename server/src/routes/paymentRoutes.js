import express from 'express';
import { initiatePayment, handleWebhook, getAllPayments, getPaymentById, getUserPayments, getDoctorPayments, updatePaymentStatus, deletePayment } from '../controllers/paymentController.js';

import userAuth from '../Middleware/userAutj.js';

const router = express.Router();

router.post('/initiate', initiatePayment);
router.post('/webhook', handleWebhook);

router.get('/',  getAllPayments);
router.get('/:id', getPaymentById);
router.get('/user/:userId',  getUserPayments);
router.get('/doctor/:doctorId', getDoctorPayments);
router.put('/:id/status', updatePaymentStatus);
router.delete('/:id',deletePayment);

export default router;
