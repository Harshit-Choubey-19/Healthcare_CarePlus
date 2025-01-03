import Appointment from "../models/appointment.js";
import Patient from "../models/patient.js";

export const getMe = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id);
    res.status(200).json(patient);
  } catch (error) {
    console.log("Error in getMe function", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDetails = async (req, res) => {
  try {
    const {
      address,
      occupation,
      medicalHistory,
      emergencyContactName,
      emergencyContactNumber,
      allergies,
    } = req.body;

    const patientID = req.user._id;
    const patient = await Patient.findById(patientID);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    patient.address = address || patient.address;
    patient.occupation = occupation || patient.occupation;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;
    patient.emergencyContactName =
      emergencyContactName || patient.emergencyContactName;
    patient.emergencyContactNumber =
      emergencyContactNumber || patient.emergencyContactNumber;
    patient.allergies = allergies || patient.allergies;

    await patient.save();

    return res
      .status(200)
      .json({ message: "Details updated successfully", data: patient });
  } catch (error) {
    console.log("Error in updateDetails function", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const patientID = req.user._id;

    const patient = await Patient.findOne({ _id: patientID });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const appointments = await Appointment.findOne({ patientId: patientID });
    if (!appointments) {
      return res.status(404).json({ error: "No appointments found" });
    }

    return res.status(200).json(appointments);
  } catch (error) {
    console.log("Error in getMyAppointments function", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
