import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import mime from "mime-types";
import dotenv from "dotenv";
import Doctor from "../models/doctorModel.js";

dotenv.config();

const generateAIResponse = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Determine if the prompt is doctor-related
    const doctorKeywords = ['doctor', 'physician', 'specialist', 'appointment', 'consult', 'medical', 'fees', 'availability','dr',Doctor.name];
    const lowerPrompt = prompt.toLowerCase();
    let isDoctorRelated = doctorKeywords.some(keyword => lowerPrompt.includes(keyword));

    let fullPrompt = prompt;

    if (isDoctorRelated) {
      try {
        // Fetch distinct specialities and cities to extract parameters
        const specialities = await Doctor.distinct('speciality');
        const cities = await Doctor.distinct('address.city');

        // Find matching speciality and city in the prompt
        let foundSpeciality = null;
        let foundCity = null;

        // Check for speciality
        for (const spec of specialities) {
          if (lowerPrompt.includes(spec.toLowerCase())) {
            foundSpeciality = spec;
            break;
          }
        }

        // Check for city
        for (const city of cities) {
          if (lowerPrompt.includes(city.toLowerCase())) {
            foundCity = city;
            break;
          }
        }

        // Build the query based on found parameters
        const query = {};
        if (foundSpeciality) query.speciality = foundSpeciality;
        if (foundCity) query['address.city'] = foundCity;

        const doctors = await Doctor.find(query);

        if (doctors.length === 0) {
          fullPrompt = `No doctors found matching your criteria. Original question: ${prompt}`;
        } else {
          // Format doctor information
          const doctorInfo = doctors.map((doc, index) => {
            const address = doc.address 
              ? [doc.address.street, doc.address.city, doc.address.state].filter(Boolean).join(', ')
              : 'Address not available';
            
            return `Doctor ${index + 1}:
- Name: ${doc.name}
- Speciality: ${doc.speciality}
- Degree: ${doc.degree}
- Experience: ${doc.experience}
- Address: ${address}
- Availability: ${doc.available ? 'Available' : 'Not available'}
- Fees: $${doc.fees}
- About: ${doc.about}`;
          }).join('\n\n');

          fullPrompt = `Here are doctors matching your query:\n\n${doctorInfo}\n\nUser's question: ${prompt}\n\nProvide a detailed answer based on the above information.`;
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        fullPrompt = `${prompt}\n\n[Error: Could not retrieve doctor data.]`;
      }
    }

    const result = await chatSession.sendMessage(fullPrompt);
    const candidates = result.response.candidates;

    // Handle inline data (if any)
    if (candidates) {
      candidates.forEach((candidate, candidate_index) => {
        candidate.content.parts.forEach((part, part_index) => {
          if (part.inlineData) {
            try {
              const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
              fs.writeFileSync(filename, Buffer.from(part.inlineData.data, "base64"));
              console.log(`File saved: ${filename}`);
            } catch (err) {
              console.error("Error saving file:", err);
            }
          }
        });
      });
    }

    res.json({ text: result.response.text() });

  } catch (err) {
    console.error("AI generation error:", err);
    res.status(500).json({ error: "Failed to generate response." });
  }
};

export { generateAIResponse };