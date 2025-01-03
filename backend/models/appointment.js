import mongoose from "mongoose";

export const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      ref: "Patient",
      required: true,
    },
    hospitalId: {
      type: String,
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    hospitalAddress: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "completed", "cancelled", "rescheduled"],
      default: "booked",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
