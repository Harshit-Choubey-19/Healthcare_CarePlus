import bcrypt from "bcryptjs";
import validator from "validator";
import Patient from "../models/patient.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import { sendOtpMsg } from "../lib/utils/sendOtpMsg.js";
import PatientOtpVerification from "../models/patientOtpVerification.js";
import { sendWelcomeMsg } from "../lib/utils/sendWelcomeMsg.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, phoneNumber } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName || !email || !phoneNumber) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingEmail = await Patient.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const existingPhoneNumber = await Patient.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return res.status(400).json({ error: "Phone number is already taken" });
    }

    // Generate custom _id
    const namePart = fullName.substring(0, 3).toUpperCase(); // Get the first 2 characters of the full name and convert to uppercase
    const yearPart = new Date().getFullYear().toString().slice(-2); // Get the last two digits of the current year
    const randomCounter = Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number

    const customId = `CP${namePart}${yearPart}${randomCounter}`;

    const newPatient = new Patient({
      _id: customId,
      fullName,
      email,
      phoneNumber,
    });

    await newPatient.save();
    generateTokenAndSetCookie(newPatient._id, res);

    const msgSent = await sendOtpMsg(newPatient, res);
    if (!msgSent) {
      return res.status(500).json({ error: "Failed to send OTP" });
    } else {
      // Check if OTP expires and delete patient if it does
      setTimeout(async () => {
        const otpRecord = await PatientOtpVerification.findOne({
          patientId: newPatient._id,
        });
        if (otpRecord && otpRecord.expiresAt < Date.now()) {
          await Patient.findByIdAndDelete(newPatient._id);
        }
      }, 3600000); // 1 hour in milliseconds

      return res.json({
        status: "PENDING",
        message: "An Otp sent to your phone number, please verify",
        date: {
          _id: newPatient._id,
          fullName: newPatient.fullName,
          email: newPatient.email,
          phoneNumber: newPatient.phoneNumber,
          isVerified: newPatient.isVerified,
        },
      });
    }
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: "Please enter Patient ID" });
    }

    const patient = await Patient.findOne({ _id: patientId });

    if (!patient) {
      return res.status(400).json({ error: "Invalid Patient ID" });
    }

    generateTokenAndSetCookie(patientId, res);

    if (!patient.isVerified) {
      const otpRecord = await PatientOtpVerification.findOne({
        patientId: patient._id,
      });
      if (!otpRecord) {
        const msgSent = await sendOtpMsg(patient, res);

        if (msgSent) {
          return res
            .status(200)
            .json({ message: "An Otp sent to your phone please verify!" });
        } else {
          return res.status(400).json({ error: "Could not send otp!" });
        }
      } else {
        return res.status(200).json({
          message:
            "Otp already sent to your registered phone number, please verify!",
        });
      }
    }
    res.status(200).json({
      message: "Login successfull!",
      data: {
        _id: patient._id,
        email: patient.email,
        fullname: patient.fullName,
        isVerified: patient.isVerified,
      },
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const patientId = req.user._id;

    let patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (!otp) {
      return res.status(400).json({ error: "Otp is required" });
    } else {
      const otpRecord = await PatientOtpVerification.find({
        patientId,
      });
      if (otpRecord.length <= 0) {
        return res.status(404).json({
          error:
            "Account record doesn't exist or already verified. Please login or signup!",
        });
      } else {
        const { expiresAt } = otpRecord[0];
        const hashedOtp = otpRecord[0].otp;

        if (expiresAt < Date.now()) {
          await PatientOtpVerification.deleteMany({ patientId });
          return res
            .status(404)
            .json({ error: "Otp expired! Please request again" });
        } else {
          const isValid = await bcrypt.compare(otp.toString(), hashedOtp);

          if (!isValid) {
            return res.status(400).json({ error: "Invalid OTP!" });
          } else {
            await Patient.updateOne({ _id: patientId }, { isVerified: true });
            await PatientOtpVerification.deleteMany({ patientId });

            const welcomeMsgSent = await sendWelcomeMsg(patient);
            if (welcomeMsgSent) {
              return res.status(200).json({
                message: "Account verified successfully!",
                data: {
                  patientId: patient._id,
                  patientName: patient.fullName,
                  patientEmail: patient.email,
                  isVerified: true,
                },
              });
            } else {
              return res.status(400).json({
                error: "Welcome msg not sent",
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.log("Error in verifyOtp:", error);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const patientId = req.user._id;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (patient.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    const otpRecord = await PatientOtpVerification.find({ patientId });

    if (otpRecord) {
      await PatientOtpVerification.deleteMany({ patientId });
    }

    const msgSent = await sendOtpMsg(patient, res);
    if (msgSent) {
      return res
        .status(200)
        .json({ message: "An Otp resent to your phone number please verify!" });
    } else {
      return res.status(400).json({ error: "Could not send otp!" });
    }
  } catch (error) {
    console.log("Error in resendOtp:", error);
    res.status(500).json({ error: "Internal server error!" });
  }
};
