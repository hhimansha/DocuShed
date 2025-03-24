// Api to get dashbord data for doctor panael
import express from "express";
//import Doctor from "../models/doctorModel"
import userAuth from "../Middleware/userAutj.js";
import { doctorProfile, updateDoctorProfile } from "../controllers/doctors.js";


const doctorRouter = express.Router()

doctorRouter.get('/profile',userAuth,doctorProfile)
doctorRouter.post('/update-profile',userAuth,updateDoctorProfile)

export default doctorRouter
