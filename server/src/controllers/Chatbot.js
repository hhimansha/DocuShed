import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Doctor from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

dotenv.config();

const generateAIResponse = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.body.userId;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
  }

  try {
    const lowerPrompt = prompt.toLowerCase();

    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.some(greet => lowerPrompt.includes(greet))) {
      return res.json({ text: "Hi! I am Asiri Hospital chatbot. How can I assist you today?" });
    }

    // ✅ If user asks about appointments
    if (
      lowerPrompt.includes("my appointment") ||
      lowerPrompt.includes("my appointments") ||
      lowerPrompt.includes("upcoming appointment")
    ) {
      try {
        const appointments = await appointmentModel.find({ userId, cancelled: false });

        if (appointments.length === 0) {
          return res.json({ text: "You have no upcoming appointments." });
        }

        const appointmentDetails = appointments.map((apt, i) => {
          return `**Appointment ${i + 1}:** - Doctor: ${apt.docData?.name} - Speciality: ${apt.docData?.speciality} - Date & Time: ${apt.slotDate} | ${apt.slotTime}`;
        }).join(" \n");
        

        return res.json({ text: `Here are your upcoming appointments:\n ${appointmentDetails}` });
        ;
      } catch (err) {
        console.error("DB appointment error:", err);
        return res.status(500).json({ text: "Sorry, could not retrieve your appointments due to a server error." });
      }
    }

    // 🌐 Use AI for general questions or doctor search
    const ai = new GoogleGenAI({ apiKey });

    const specialities = await Doctor.distinct("speciality");
    const cities = await Doctor.distinct("address.city");

    const foundSpeciality = specialities.find(spec =>
      lowerPrompt.includes(spec.toLowerCase())
    );
    const foundCity = cities.find(city =>
      lowerPrompt.includes(city.toLowerCase())
    );

    const query = {};
    if (foundSpeciality) query.speciality = foundSpeciality;
    if (foundCity) query["address.city"] = foundCity;

    const doctors = await Doctor.find(query);

    let fullPrompt = "";

    if (doctors.length === 0) {
      fullPrompt = `No doctors found in our database. User's question: ${prompt}`;
    } else {
      const doctorInfo = doctors.map((doc, index) => {
        const address = doc.address
          ? [doc.address.street, doc.address.city, doc.address.state].filter(Boolean).join(", ")
          : "Address not available";

        return `Doctor ${index + 1}:
- Name: ${doc.name}
- Speciality: ${doc.speciality}
- Degree: ${doc.degree}
- Experience: ${doc.experience}
- Address: ${address}
- Availability: ${doc.available ? "Available" : "Not available"}
- Fees: $${doc.fees}
- About: ${doc.about}`;
      }).join("\n\n");

      fullPrompt = `Our database contains these doctors:\n\n${doctorInfo}\n\nUser's question: ${prompt}\n\nProvide a helpful and relevant response.`;
    }

    const response = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    const resultText = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.json({ text: resultText });

  } catch (err) {
    console.error("AI generation error:", err);
    res.status(500).json({ error: "Failed to generate response." });
  }
};

export { generateAIResponse };
