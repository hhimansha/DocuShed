import appointmentModel from "../models/appointmentModel.js"
import Doctor from "../models/doctorModel.js"
import User from "../models/userModel.js"
import nodemailer from "nodemailer"
import PDFDocument from "pdfkit"
import getStream from 'get-stream';

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

    const appointment = await appointmentModel.findById(appointmentId)
      .populate("doctor")
      .populate("patient");

    if (!appointment || appointment.doctorsId !== userId) {
      return res.json({ success: false, message: "Invalid or unauthorized" });
    }

    // ✅ Update status
    appointment.isCompleted = true;
    appointment.status = "Approved";

    // ✅ Calculate start/end times if not set
    const [day, month, year] = appointment.slotDate.split("_");
    const [hour, minute] = appointment.slotTime.split(":");
    const startTime = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour}:${minute}:00`);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

    const meetLink = "https://meet.google.com/new";

    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.meetLink = meetLink;
    await appointment.save();

    // ✅ Generate PDF
    const doc = new PDFDocument();
    doc.fontSize(16).text("DocuSched Appointment Confirmation", { align: "center" });
    doc.moveDown();
    doc.text(`Doctor: Dr. ${appointment.doctor.name}`);
    doc.text(`Patient: ${appointment.patient.name}`);
    doc.text(`Date & Time: ${startTime.toLocaleString()}`);
    doc.text(`Google Meet: ${meetLink}`);
    doc.end();
    const pdfBuffer = await getStream(doc);


    // ✅ Send email to both doctor and patient
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"DocuSched" <${process.env.EMAIL_USER}>`,
      to: [appointment.doctor?.email, appointment.patient?.email].filter(Boolean),
      subject: "Your Appointment is Confirmed with Google Meet",
      html: `
        <h3>Appointment Confirmed</h3>
        <p><b>Doctor:</b> Dr. ${appointment.doctor.name}</p>
        <p><b>Date:</b> ${startTime.toLocaleString()}</p>
        <p><b>Google Meet Link:</b> <a href="${meetLink}">${meetLink}</a></p>
      `,
      attachments: [{
        filename: "appointment.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      }],
    };

    await transporter.sendMail(mailOptions);

    // ✅ Send PDF buffer back to frontend
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=appointment_${appointment._id}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error in appointmentComplete:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export { changeAvailability, doctorProfile, updateDoctorProfile,appointmentsDoctor,appointmentCancel,appointmentComplete }