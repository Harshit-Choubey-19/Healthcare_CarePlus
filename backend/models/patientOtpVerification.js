import mongoose from "mongoose";

const patientOtpVerificationSchema = new mongoose.Schema({
  patientId: {
    type: String,
    ref: "Patient",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
});

const PatientOtpVerification = mongoose.model(
  "PatientOtpVerification",
  patientOtpVerificationSchema
);
export default PatientOtpVerification;
