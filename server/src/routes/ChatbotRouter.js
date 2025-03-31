import express from "express";
import { generateAIResponse } from "../controllers/Chatbot.js";
import userAuth from "../Middleware/userAutj.js";
const chatbotrouter = express.Router();

// Define your route without the /api/ai prefix, as it's already added by app.use
chatbotrouter.post("/generate",userAuth, generateAIResponse);

export default chatbotrouter;
