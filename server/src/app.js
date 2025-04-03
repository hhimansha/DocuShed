import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/AdminRoutes.js";
import authrouter  from "./routes/userRoutes.js"
import doctorRouter from "./routes/DoctorRoute.js";
import chatbotrouter from "./routes/chatbotrouter.js";
import session from 'express-session';

// import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const alloweOrigins=['http://localhost:5173','']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:alloweOrigins,credentials:true}))

app.get('/',(req,res)=>res.send("API working fine"));




// Routes
 app.use("/api/admin", adminRouter)
 app.use("/api/auth",authrouter)
 app.use("/api/doctor",doctorRouter)
 app.use('/api/ai',chatbotrouter)
 
 
export default app;
