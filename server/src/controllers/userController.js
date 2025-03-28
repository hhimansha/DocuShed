import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { Email_very_template } from '../config/Emailtemplate.js';
import validator from "validator";
import Doctor from '../models/doctorModel.js';
import {v2 as cloudinary}from 'cloudinary'
//import { Email_very_template } from '../config/Emailtemplate.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Check missing fields
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing details' });
    }

    try {
        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password (min 8 characters)" });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Save new user
        const user = new userModel({ name, email, password: hashPassword });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, ({ expiresIn: '7d' }));

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //sending welcome email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to pizza hut ',
            text: `Welcome to Prescripto: ${email}`
        }

        await transporter.sendMail(mailOption);

        // Success response
        return res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ success: false, message: 'Server Error', error });
    }

};


export const login = async (req, res) => {
    const { password, email } = req.body;

    // Check if password and email are received correctly
    console.log(req.body);

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email' })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password' })
        }



        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            status: 'success',
            message: 'login sucess',
            userId: user._id,
            role: user.role,

            isAdmin: user.role === 'admin',
            isStaff: user.role === 'doctor'
        });


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const checktoken = async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        return res.json({ isLoggedIn: true });
    } else {
        return res.json({ isLoggedIn: false });
    }
};






export const logout = async (req, res) => {

    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

        })

        return res.json({ success: true, message: 'logout' });





    } catch (error) {
        return res.json({ success: false, message: error.message })
    }


}

export const getUserData = async (req, res) => {
    try {

        const { userId, role } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            res.json({ success: false, message: 'user not found' });
        }


        res.json({
            success: true,
            userData: {
                name: user.name,
                role: user.role,
                image: user.image,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                address: user.address || { line1: '', line2: '' }, // Handle if address is undefined
                isAccountVerified: user.isAccountVerified
            }
        });
        
        



    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const allDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });  // lowercase
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};



export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: 'Email is required' })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))  //0.123456*900000=111,110.4+100000=211,110.4=211110 6bit otp

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'password rest  otp ',
            html: Email_very_template.replace("{{otp}}", otp)
        };

        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: 'OTP sent to your email' });

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const resetpassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email ,OTP,and new password are required' })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'user not found' })
        }
        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password (min 8 characters)" });
        }


        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP expired' })
        }

        const hashpassword = await bcrypt.hash(newPassword, 10);

        user.password = hashpassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: 'password hash been reset successfully' });


    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        return res.json({ success: true, message: "OTP verified successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
// API to update user profile

export const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !gender) {
            return res.json({ success: false, message: "Data missing" });
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), gender });

        if (imageFile) {
            // Upload image to Cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageUrl = imageUpload.secure_url; // ✅ Fixed issue here
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

 // Assuming the path to your user model

export const userRestPassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword) {
    return res.json({ success: false, message: "Data missing" });
  }

  try {
    // Find user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "No user available" });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Current password invalid" });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a strong password (min 8 characters)" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

   
    user.password = hashPassword;
    await user.save();

    
    return res.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    bookAppointment,
    listAppointment,
    cancelAppointment,
}



