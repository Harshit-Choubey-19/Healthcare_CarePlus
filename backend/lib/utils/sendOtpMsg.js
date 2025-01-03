import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import PatientOtpVerification from "../../models/patientOtpVerification.js";
import twilio from "twilio";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const sendOtpMsg = async (user, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp.toString(), salt); // Ensure OTP is a string

    let msgOptions = {
      from: process.env.TWILIO_FROM_NUMBER,
      to: user.phoneNumber,
      body: `Thank you for choosing CarePlus. Your OTP is ${otp}`,
    };

    await client.messages.create(msgOptions);

    const newOtpVerification = new PatientOtpVerification({
      patientId: user._id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    await newOtpVerification.save();

    return true;
  } catch (error) {
    console.log("Error in sendOtpMsg", error.message);
    return false;
  }
};
