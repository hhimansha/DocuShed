import Payment from '../models/Payment.js';
import crypto from 'crypto';
import appointmentModel from '../models/appointmentModel.js';

// PayHere configuration
const PAYHERE_CONFIG = {
  MERCHANT_ID: process.env.PAYHERE_MERCHANT_ID,
  MERCHANT_SECRET: process.env.PAYHERE_MERCHANT_SECRET,
  BASE_URL: process.env.PAYHERE_BASE_URL || 'https://sandbox.payhere.lk',
  RETURN_URL: `${process.env.FRONTEND_URL}/payment-success`,
  CANCEL_URL: `${process.env.FRONTEND_URL}/payment-cancel`
};

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export const initiatePayment = async (req, res) => {
    try {
      const { appointmentId, doctorId, userId, amount, doctorName, userFirstName, userLastName, userEmail, userPhone } = req.body;
      
      // Validate required fields
      if (!appointmentId || !doctorId || !userId || !amount || !doctorName || !userEmail) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields' 
        });
      }
  
      // Convert amount to proper format (LKR as string with 2 decimal places)
      const payhereAmount = (amount).toFixed(2);
      
      // Create payment record
      const payment = await Payment.create({
        appointmentId,
        doctorId,
        userId,
        amount,
        payhereAmount,
        status: 'pending',
        currency: 'LKR'
      });
  
      // PayHere payment request payload
      const paymentData = {
        merchant_id: PAYHERE_CONFIG.MERCHANT_ID,
        return_url: PAYHERE_CONFIG.RETURN_URL,
        cancel_url: PAYHERE_CONFIG.CANCEL_URL,
        notify_url: `${BACKEND_URL}/api/payments/webhook`,
        order_id: payment._id.toString(),
        items: `Appointment with Dr. ${doctorName}`.substring(0, 50), // Max 50 chars
        amount: payhereAmount,
        currency: 'LKR',
        first_name: userFirstName || 'Customer',
        last_name: userLastName || '',
        email: userEmail,
        phone: userPhone || '0771234567',
        address: 'Appointment Payment',
        city: 'Colombo',
        country: 'Sri Lanka',
        custom_1: appointmentId,
        custom_2: doctorId
      };
  
      // CORRECTED HASH GENERATION
      const innerHash = crypto.createHash('md5')
        .update(PAYHERE_CONFIG.MERCHANT_SECRET)
        .digest('hex')
        .toUpperCase();
  
      const hashString = [
        PAYHERE_CONFIG.MERCHANT_ID,
        paymentData.order_id,
        paymentData.amount,
        paymentData.currency,
        innerHash
      ].join('');
  
      paymentData.hash = crypto.createHash('md5')
        .update(hashString)
        .digest('hex')
        .toUpperCase();

      res.status(200).json({
        success: true,
        paymentData,
        paymentId: payment._id
      });
  
    } catch (error) {
      console.error('Payment initiation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Payment initiation failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
// Handle PayHere webhook
export const handleWebhook = async (req, res) => {
  try {
    const { order_id, payment_id, status_code, md5sig, custom_1 } = req.body;
    
    // Verify the signature
    const expectedSignature = crypto.createHash('md5')
      .update(
        PAYHERE_CONFIG.MERCHANT_ID + 
        order_id + 
        payment_id + 
        status_code + 
        PAYHERE_CONFIG.MERCHANT_SECRET
      )
      .digest('hex')
      .toUpperCase();

    if (md5sig !== expectedSignature) {
      console.warn('Invalid webhook signature received');
      return res.status(400).send('Invalid signature');
    }

    // Update payment status
    const payment = await Payment.findByIdAndUpdate(
      order_id,
      {
        payherePaymentId: payment_id,
        status: status_code === '2' ? 'completed' : 
               (status_code === '0' ? 'pending' : 'failed'),
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!payment) {
      console.error('Payment not found for order_id:', order_id);
      return res.status(404).send('Payment not found');
    }

    // Only update appointment if payment was successful (status_code 2)
    if (status_code === '2') {
      await appointmentModel.findByIdAndUpdate(
        payment.appointmentId, // or custom_1 if you prefer
        { payment: true },
        { new: true }
      );
      console.log(`Appointment ${payment.appointmentId} marked as paid`);
    }

    console.log(`Payment ${payment._id} updated to status: ${payment.status}`);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook processing failed');
  }
};

// Get all payments with populated data
export const getAllPayments = async (req, res) => {
    try {
      const payments = await Payment.find()
        .sort({ createdAt: -1 })
        .populate({
          path: 'userId',
          model: 'User',
          select: 'name email'
        })
        .populate({
          path: 'doctorId',
            model: 'Doctor',
          select: 'name specialization image'
        });
  
      res.status(200).json({ success: true, data: payments });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Get payment by ID with full details
  export const getPaymentById = async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id)
        .populate({
          path: 'userId',
            model: 'User',
          select: 'name email phone'
        })
        .populate({
          path: 'doctorId',
            model: 'Doctor',
          select: 'name specialization image qualifications'
        })
        // .populate({
        //   path: 'appointmentId',
        //   select: 'date timeSlot notes'
        // });
  
      if (!payment) {
        return res.status(404).json({ success: false, error: 'Payment not found' });
      }
  
      res.status(200).json({ success: true, data: payment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Get payments by user with doctor and appointment details
  export const getUserPayments = async (req, res) => {
    try {
      const payments = await Payment.find({ userId: req.params.userId })
        .sort({ createdAt: -1 })
        .populate({
          path: 'doctorId',
            model: 'Doctor',
          select: 'name specialization image'
        })
        .populate({
          path: 'appointmentId',
          select: 'date timeSlot'
        });
  
      res.status(200).json({ 
        success: true, 
        data: payments.map(payment => ({
          _id: payment._id,
          amount: payment.amount,
          status: payment.status,
          createdAt: payment.createdAt,
          doctor: {
            name: payment.doctorId.name,
            specialization: payment.doctorId.specialization,
            image: payment.doctorId.image
          },
          appointment: {
            date: payment.appointmentId.date,
            timeSlot: payment.appointmentId.timeSlot
          }
        }))
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Get payments by doctor with user details
  export const getDoctorPayments = async (req, res) => {
    try {
      const payments = await Payment.find({ doctorId: req.params.doctorId })
        .sort({ createdAt: -1 })
        .populate({
          path: 'userId',
          model: 'User',
          select: 'name email'
        })
        .populate({
          path: 'appointmentId',
          select: 'date timeSlot'
        });
  
      res.status(200).json({ 
        success: true, 
        data: payments.map(payment => ({
          _id: payment._id,
          amount: payment.amount,
          status: payment.status,
          createdAt: payment.createdAt,
          patient: {
            userId: payment.userId._id,
            name: payment.userId.name,
            email: payment.userId.email
          },
          appointment: {
            appointmentId: payment.appointmentId._id,
            date: payment.appointmentId.date,
            timeSlot: payment.appointmentId.timeSlot
          }
        }))
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  export const updatePaymentStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      // Validate status
      const validStatuses = ['success', 'pending', 'canceled', 'failed', 'chargedback'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid status value' 
        });
      }
  
      const updatedPayment = await Payment.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!updatedPayment) {
        return res.status(404).json({ 
          success: false, 
          error: 'Payment not found' 
        });
      }
  
      res.json({ 
        success: true, 
        payment: updatedPayment 
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update payment status' 
      });
    }
  };
  
    // Delete payment
  export const deletePayment = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedPayment = await Payment.findByIdAndDelete(id);
  
      if (!deletedPayment) {
        return res.status(404).json({ 
          success: false, 
          error: 'Payment not found' 
        });
      }
  
      res.json({ 
        success: true, 
        message: 'Payment deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete payment' 
      });
    }
  };

