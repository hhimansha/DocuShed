import validator from "validator";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";  // This is correct
//import Doctor from "../models/doctorModel.js";


// API for Admin to Add Doctor
const addDoctor = async (req, res) => {
    
    try {
        const { name, email, password, speciality, degree, experience, about, fees,address } = req.body;
        const imageFile = req.file;
        console.log({ name, email, password, speciality, degree, experience, about, fees ,address}, imageFile);


        // Check for missing details
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }
        

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate strong password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password (min 8 characters)" });
        }

        // Check if email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered!" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        let imageUrl = "";
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        // Create new user with doctor role
        const userData = await userModel.create({
            name,
            email,
            password: hashPassword,
            role: "doctor",
            image: imageUrl
        });

        // Create doctor details and link to the user
        const newDoctor = await Doctor.create({
            userId: userData._id,
            name,
            email,
           image:imageUrl,
            speciality,
            degree,
            experience,
            about,
            address:JSON.parse(address),
            fees
           
        });

        // Link doctor details to user
        userData.doctorDetails = newDoctor._id;
        await userData.save();

        res.status(201).json({ success: true, message: "Doctor added successfully!" });


    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};
const allDoctors = async (req, res) => {
    try {
      const doctors = await Doctor.find({}).select('-password');
      res.json({ success: true, doctors });  // lowercase
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  };


  // API to get dahbord data for admin pannel

  const admindashbord = async (req,res) =>{
    try {
        const doctors =await Doctor.find({})
        const users = await userModel.find({
            role: 'user'
          });


          const dashData= {
            doctors: doctors.length,
            patients:users.length
          }

          res.json({success:true,dashData})
          
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server Error", error });
        
    }
  }
  


export { addDoctor,allDoctors,admindashbord };
