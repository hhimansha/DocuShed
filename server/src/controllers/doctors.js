//change availablity

import appointmentModel from "../models/appointmentModel.js"
import Doctor from "../models/doctorModel.js"

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

      const { userId, appointmentId } = req.body

      const appointmentData = await appointmentModel.findById(appointmentId)
      if (appointmentData && appointmentData.doctorsId === userId) {
          await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
          return res.json({ success: true, message: 'Appointment Completed' })
      }

      res.json({ success: false, message: 'Appointment Cancelled' })

  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }

}





export { changeAvailability, doctorProfile, updateDoctorProfile,appointmentsDoctor,appointmentCancel,appointmentComplete }
