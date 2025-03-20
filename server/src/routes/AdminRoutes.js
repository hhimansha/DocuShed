import express from "express";


import { addDoctor } from "../controllers/Admincontorl.js";
import upload from "../Middleware/multer.js";
import userAuth from "../Middleware/userAutj.js";


const adminRouter = express.Router()

adminRouter.post('/add-doctor',userAuth, upload.single('image'), addDoctor)



export default adminRouter