import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'appointments'
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'doctors'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  amount: {
    type: Number,
    required: true
  },
  payhereAmount: {
    type: Number
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  payherePaymentId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
