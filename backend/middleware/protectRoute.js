import jwt from "jsonwebtoken";
import Patient from "../models/patient.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized! Login first" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized! Login first" });
    }

    const patient = await Patient.findById(decoded.userId);

    if (!patient) {
      return res.status(401).json({ error: "Patient not found!" });
    }

    req.user = patient;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
