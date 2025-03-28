import express from "express";


=======
import { allDoctors, checktoken, getUserData, login, logout, register, resetpassword, sendResetOtp, updateProfile, userRestPassword, verifyResetOtp, bookAppointment, listAppointment, cancelAppointment } from "../controllers/userController.js";

// import { getUsers } from "../controllers/userController";
import userAuth from "../Middleware/userAutj.js";
import upload from "../Middleware/multer.js";
import { allpatient } from "../controllers/Admincontorl.js";
//import { allDoctors } from "../controllers/Admincontorl.js";


const authrouter = express.Router()

authrouter.post('/register',register)
authrouter.post('/login',login)
authrouter.post('/logout',logout)
authrouter.get('/checktoken', checktoken); 
authrouter.get('/data',userAuth,getUserData);
authrouter.get('/all-doctors',allDoctors)
authrouter.post('/send-reset-otp',sendResetOtp);
authrouter.post('/reset-password',resetpassword);
authrouter.post('/verifyResetOtp',verifyResetOtp);
authrouter.post('/update-profile',upload.single('image'),userAuth,updateProfile)
authrouter.post("/book-appointment", userAuth, bookAppointment)
authrouter.get("/appointments", userAuth, listAppointment)
authrouter.post("/cancel-appointment", userAuth, cancelAppointment)
authrouter.post('/user-rest-password',userAuth,userRestPassword);
authrouter.get('/allpatient',userAuth,allpatient);
authrouter.delete('/delete-user',userAuth,deleteUserAccount);





export default authrouter;
