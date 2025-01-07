import jwt from "jsonwebtoken";
import Patient from "../models/patient.js";

export const appointmentProtectRoute = async (req, res, next) => {
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

    const registrationDone = patient.isRegistrationComplete;

    if (!registrationDone) {
      return res
        .status(400)
        .json({ error: "Please complete your registration first" });
    }

    next();
  } catch (error) {
    console.log("Error in appointment protect route", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
