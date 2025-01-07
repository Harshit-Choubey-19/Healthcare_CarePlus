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
      prescription, // Destructure the entire prescription object
    } = req.body;

    // Destructure the nested prescription object
    const { doctorName, medicines, comment, prescriptionDate } =
      prescription || {};

    const patientID = req.user._id; // Assuming `req.user` contains the authenticated user's ID.
    const patient = await Patient.findById(patientID);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Update patient general details
    if (address !== undefined) patient.address = address;
    if (occupation !== undefined) patient.occupation = occupation;
    if (medicalHistory !== undefined) patient.medicalHistory = medicalHistory;
    if (emergencyContactName !== undefined)
      patient.emergencyContactName = emergencyContactName;
    if (emergencyContactNumber !== undefined)
      patient.emergencyContactNumber = emergencyContactNumber;
    if (allergies !== undefined) patient.allergies = allergies;

    // Initialize prescription if not defined
    if (!patient.prescription) {
      patient.prescription = {};
    }

    // Update prescription fields
    if (prescriptionDate !== undefined) {
      patient.prescription.prescriptionDate = new Date(prescriptionDate); // Ensure date is properly set.
    }
    if (doctorName !== undefined) {
      patient.prescription.doctorName = doctorName;
    }
    if (comment !== undefined) {
      patient.prescription.comment = comment;
    }
    if (Array.isArray(medicines)) {
      patient.prescription.medicines = medicines.map((medicine) => ({
        name: medicine.name,
        dosage: medicine.dosage,
      }));
    }

    // Explicitly mark prescription as modified
    patient.markModified("prescription");

    // Save the updated patient document
    await patient.save();

    return res
      .status(200)
      .json({ message: "Details updated successfully", data: patient });
  } catch (error) {
    console.error("Error in updateDetails function:", error.message);
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

    const appointments = await Appointment.find({ patientId: patientID });
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ error: "No appointments found" });
    }

    return res.status(200).json(appointments);
  } catch (error) {
    console.log("Error in getMyAppointments function", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
