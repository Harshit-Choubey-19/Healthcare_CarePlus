import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  prescriptionDate: {
    type: Date,
  },
  doctor: {
    type: String,
  },
  medicines: [
    {
      name: {
        type: String,
      },
      dosage: {
        type: String,
      },
    },
  ],
  comment: {
    type: String,
  },
});

const pateintSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    privacyConsent: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dob: {
      type: Date,
    },
    age: {
      type: Number,
    },
    address: {
      type: String,
    },
    occupation: {
      type: String,
    },
    medicalHistory: {
      type: String,
    },
    emergencyContactName: {
      type: String,
    },
    emergencyContactNumber: {
      type: String,
    },
    allergies: {
      type: String,
    },
    identificationType: {
      type: String,
      enum: ["driving license", "passport", "aadhar", "other government id"],
    },
    identificationNumber: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isReistrationComplete: {
      type: Boolean,
      default: false,
    },
    prescriptions: prescriptionSchema,
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", pateintSchema);

export default Patient;
