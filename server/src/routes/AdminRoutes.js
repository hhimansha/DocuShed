import express from "express";


import { addDoctor, admindashbord, allDoctors, doctordelete, patientdelete, appointmentsAdmin, appointmentCancel} from "../controllers/Admincontorl.js";
import upload from "../Middleware/multer.js";
import userAuth from "../Middleware/userAutj.js";
import { changeAvailability } from "../controllers/doctors.js";


const adminRouter = express.Router()

adminRouter.post('/add-doctor',userAuth, upload.single('image'), addDoctor)
adminRouter.get('/all-doctors',userAuth,allDoctors);
adminRouter.get("/appointments", userAuth, appointmentsAdmin)
adminRouter.post("/cancel-appointment", userAuth, appointmentCancel)
adminRouter.post('/change-availability',userAuth, changeAvailability);
adminRouter.get('/dashbord',userAuth,admindashbord);
adminRouter.delete('/patients/:id',userAuth,patientdelete);
adminRouter.delete('/doctordelete/:id',userAuth,doctordelete)

export default adminRouter