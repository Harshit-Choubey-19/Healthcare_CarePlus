import mongoose from "mongoose";
import { appointmentSchema } from "./appointment.js";

const hospitalSchema = new mongoose.Schema({
  googlePlaceId: {
    type: String,
    required: true,
    unique: true,
  },
  appointments: [appointmentSchema],
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
