import appointmentModel from "../models/appointmentModel.js"
import Doctor from "../models/doctorModel.js"
import nodemailer from '../config/nodemailer.js'
import { google } from 'googleapis'

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body

    const docData = await Doctor.findById(docId)
    await Doctor.findByIdAndUpdate(docId, { available: !docData.available })
    res.json({ success: true, message: 'Availability change' })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

// API to get doctor profile for doctor pannel

const doctorProfile = async (req, res) => {
  try {
    const { userId } = req.body; 
    const profileDta = await Doctor.findOne({ userId }).select('-password'); // Note: Match with your DB structure
    res.json({ success: true, profileDta });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



//API TO UPDATE doctor profile data for doctor panel

const updateDoctorProfile = async (req, res) => {
  try {
    const { userId, fees, address, available,about } = req.body;

    const updatedProfile = await Doctor.findOneAndUpdate(
      { userId }, // Correct field
      { fees, address, available,about },
      { new: true } // Return updated profile
    );

    if (!updatedProfile) {
      return res.json({ success: false, message: 'Doctor not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully', updatedProfile });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const appointmentsDoctor = async (req, res) => {
  try {

      const { userId } = req.body
      const appointments = await appointmentModel.find({ doctorsId:userId })

      res.json({ success: true, appointments })

  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }
}

const appointmentCancel = async (req, res) => {
  try {

      const {userId, appointmentId } = req.body

      const appointmentData = await appointmentModel.findById(appointmentId)
      if (appointmentData && appointmentData.doctorsId === userId) {
          await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
          return res.json({ success: true, message: 'Appointment Cancelled' })
      }

      res.json({ success: false, message: 'Appointment Cancelled' })

  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }

}

const appointmentComplete = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId).populate('userData');
    if (appointmentData && appointmentData.doctorsId === userId) {
      // 1. Create Google Meet link via Google Calendar
      const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
      oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

      const event = {
        summary: 'Doctor Appointment',
        description: 'Online Appointment',
        start: {
          dateTime: new Date().toISOString(), // You can use appointmentData.slotDate & slotTime
          timeZone: 'Asia/Colombo',
        },
        end: {
          dateTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 min meeting
          timeZone: 'Asia/Colombo',
        },
        conferenceData: {
          createRequest: { requestId: Math.random().toString(36).substring(2) },
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
      });

      const meetLink = response.data.hangoutLink;

      // 2. Update appointment with Google Meet link and mark as completed
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true, meetLink });

      // 3. Send Email to user
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: appointmentData.userData.email, // Make sure userData.email is populated
        subject: 'Your Appointment is Confirmed!',
        html: `
          <h2>Your Appointment is Confirmed ✅</h2>
          <p>Date: ${appointmentData.slotDate}</p>
          <p>Time: ${appointmentData.slotTime}</p>
          <p>Google Meet Link: <a href="${meetLink}">${meetLink}</a></p>
        `,
      };

      await nodemailer.sendMail(mailOptions);

      return res.json({ success: true, message: 'Appointment Completed & Link Sent', meetLink });
    }

    res.json({ success: false, message: 'Invalid Appointment' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};







export { changeAvailability, doctorProfile, updateDoctorProfile,appointmentsDoctor,appointmentCancel,appointmentComplete }