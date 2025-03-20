import express from "express";
import { checktoken, login, logout, register } from "../controllers/userController.js";
// import { getUsers } from "../controllers/userController";


const authrouter = express.Router()

authrouter.post('/register',register)
authrouter.post('/login',login)
authrouter.post('/logout',logout)
authrouter.get('/checktoken', checktoken); 



export default authrouter;
