// Api to get dashbord data for doctor panael
import express from "express";
//import Doctor from "../models/doctorModel"
import userAuth from "../Middleware/userAutj.js";
import { doctorProfile, updateDoctorProfile,appointmentsDoctor, appointmentCancel, appointmentComplete} from "../controllers/doctors.js";


const doctorRouter = express.Router()

doctorRouter.get('/profile',userAuth, doctorProfile)
doctorRouter.post('/update-profile',userAuth, updateDoctorProfile)
doctorRouter.post("/cancel-appointment", userAuth, appointmentCancel)
doctorRouter.post("/complete-appointment", userAuth, appointmentComplete)
doctorRouter.get("/appointments", userAuth, appointmentsDoctor)

export default doctorRouter
