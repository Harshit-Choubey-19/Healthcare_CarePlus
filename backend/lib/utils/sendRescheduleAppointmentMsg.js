import dotenv from "dotenv";
import twilio from "twilio";
import moment from "moment-timezone";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const sendRescheduleAppointmentMsg = async (
  user,
  hospitalName,
  date
) => {
  const NAME = user.fullName.toUpperCase();
  try {
    const TIMEZONE = "Asia/Kolkata";
    // Parse the date and time using moment-timezone
    const dateWithTime = moment
      .tz(date, "YYYY-MM-DDTHH:mm:ss", TIMEZONE)
      .toDate();
    const readableDate = moment(dateWithTime)
      .tz(TIMEZONE)
      .format("dddd, MMMM Do YYYY");
    const readableTime = moment(dateWithTime).tz(TIMEZONE).format("hh:mm A");

    let msgOptions = {
      from: process.env.TWILIO_FROM_NUMBER,
      to: user.phoneNumber,
      body: `Dear ${NAME}, with Patient ID: [${user._id}], your appointment at ${hospitalName} has been rescheduled to ${readableDate} at ${readableTime}. Please arrive at the hospital 15 minutes before your scheduled time to complete all necessary formalities. Stay healthy and take care!     -Team CarePlus`,
    };
    await client.messages.create(msgOptions);
    return true;
  } catch (error) {
    console.error("Error sending appointment message:", error);
    return false;
  }
};
