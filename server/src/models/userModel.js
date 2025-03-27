import mongoose from 'mongoose';
//import Doctor from './doctorDetails'; // Import the Doctor model

const rolesEnum = ['user', 'admin', 'doctor'];

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    role: {
        type: String,
        enum: rolesEnum,
        default: 'user' // Default role is 'user'
    },
    image: { type: String, default: "" },
    phone: { type: String, default:'' },
    address: { type: Object, default:'' },
    gender: { type: String, default:'' },
   
    

    // Link to the Doctor model (reference)
    doctorDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },

}, { minimize: false });

const userModel = mongoose.model('User', userSchema);

export default userModel;
