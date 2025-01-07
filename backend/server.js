import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import connectMongoDB from "./db/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json({ limit: "5mb" })); //to parse req.body
app.use(express.urlencoded({ extended: true })); //to parse form data
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/hospitals", hospitalRoutes);

app.get("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
