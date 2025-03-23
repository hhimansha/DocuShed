import express from "express";
import { allDoctors, checktoken, getUserData, login, logout, register, resetpassword, sendResetOtp, verifyResetOtp } from "../controllers/userController.js";
// import { getUsers } from "../controllers/userController";
import userAuth from "../Middleware/userAutj.js";
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






export default authrouter;
