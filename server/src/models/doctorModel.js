import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: false },
    fees: { type: Number, required: true },
    address: { type: Object, required:true },
    
    date: { type: Number, default: Date.now },
    slots_booked: { type: Object, default: {} }
}, { minimize: false });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
