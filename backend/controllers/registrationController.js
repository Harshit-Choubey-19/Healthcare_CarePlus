import Patient from "../models/patient.js";

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const register = async (req, res) => {
  try {
    const {
      gender,
      dob,
      address,
      occupation,
      medicalHistory,
      emergencyContactName,
      emergencyContactNumber,
      allergies,
      identificationType,
      identificationNumber,
      privacyConsent,
      prescription,
    } = req.body;

    const patientId = req.user._id;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (
      !gender ||
      !dob ||
      !address ||
      !occupation ||
      !medicalHistory ||
      !emergencyContactName ||
      !emergencyContactNumber ||
      !allergies ||
      !identificationType ||
      !identificationNumber ||
      !prescription
    ) {
      return res.status(400).json({ error: "Please fill in all the fields" });
    }

    if (!privacyConsent) {
      return res
        .status(400)
        .json({ error: "Please agree to the privacy policy" });
    }

    const age = calculateAge(dob);

    await Patient.findByIdAndUpdate(
      patientId,
      {
        gender,
        dob,
        age,
        address,
        occupation,
        medicalHistory,
        emergencyContactName,
        emergencyContactNumber,
        allergies,
        identificationType,
        identificationNumber,
        privacyConsent,
        prescription,
        isRegistrationComplete: true,
      },
      { new: true }
    );

    return res.json({
      message: "Patient registration completed successfully",
      data: {
        patientId: patient._id,
        patientName: patient.fullName,
        gender,
        dob,
        age,
        address,
        occupation,
        medicalHistory,
        emergencyContactName,
        emergencyContactNumber,
        allergies,
        identificationType,
        identificationNumber,
        privacyConsent,
        prescription,
        isRegistrationComplete: patient.isRegistrationComplete,
      },
    });
  } catch (error) {
    console.log("Error in register controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
