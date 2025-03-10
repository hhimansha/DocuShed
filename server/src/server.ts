import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
