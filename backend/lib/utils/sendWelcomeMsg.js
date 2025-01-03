import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const sendWelcomeMsg = async (user) => {
  const NAME = user.fullName.toUpperCase();
  try {
    let msgOptions = {
      from: process.env.TWILIO_FROM_NUMBER,
      to: user.phoneNumber,
      body: `Dear ${NAME}, WELCOME to CAREPLUS Healthcare. Your Patient ID is: ${user._id}. Remember to schedule an appointment with our doctors to stay healthy!`,
    };
    await client.messages.create(msgOptions);
    return true;
  } catch (error) {
    console.error("Error sending welcome message:", error);
    return false;
  }
};
