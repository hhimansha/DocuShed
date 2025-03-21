import app from "./app.js";
import { connectDB } from "./config/db.js";
import connectCloudinary from "./config/cloudnary.js";

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB();
connectCloudinary();



app.get('/',(req,res)=>res.send("API working hi fine"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
