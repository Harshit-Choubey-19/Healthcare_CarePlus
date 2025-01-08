import axios from "axios";
import moment from "moment-timezone";
import Hospital from "../models/hospital.js";
import Appointment from "../models/appointment.js";
import { sendAppointmentMsg } from "../lib/utils/sendAppointmentMsg.js";
import { sendCancellAppointmentMsg } from "../lib/utils/sendCancellAppointmentMsg.js";
import { sendRescheduleAppointmentMsg } from "../lib/utils/sendRescheduleAppointmentMsg.js";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

export const hospitals = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000, // 5 km radius
          type: "hospital",
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const hospitalDetailsPromises = response.data.results.map(
      async (hospital) => {
        const detailsResponse = await axios.get(
          "https://maps.googleapis.com/maps/api/place/details/json",
          {
            params: {
              place_id: hospital.place_id,
              key: process.env.GOOGLE_MAPS_API_KEY,
            },
          }
        );

        const details = detailsResponse.data.result;

        // Calculate distance from user location to hospital
        const hospitalLat = hospital.geometry.location.lat;
        const hospitalLng = hospital.geometry.location.lng;
        const distance = calculateDistance(lat, lng, hospitalLat, hospitalLng);

        // Format distance: if less than 1 km, show in metres
        const formattedDistance =
          distance < 1
            ? `${(distance * 1000).toFixed(0)} m` // Convert to metres
            : `${distance.toFixed(2)} km`; // Keep in km

        return {
          id: hospital.place_id,
          name: hospital.name,
          address: hospital.vicinity,
          location: {
            lat: hospital.geometry.location.lat,
            lng: hospital.geometry.location.lng,
          },
          contactInformation: {
            phone: details.formatted_phone_number || "N/A",
            website: details.website || "N/A",
          },
          rating: details.rating || "N/A", // Include hospital rating
          distance: formattedDistance, // Include distance in km
        };
      }
    );

    const hospitals = await Promise.all(hospitalDetailsPromises);

    res.json(hospitals);
  } catch (error) {
    console.error("Error fetching nearby hospitals:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    const { hospitalId } = req.params;
    const { hospitalName, hospitalAddress } = req.query;
    const patientId = req.user._id;

    if (!date || !time) {
      return res.status(400).json({ error: "Date and time are required" });
    }

    // Set the timezone explicitly
    const TIMEZONE = "Asia/Kolkata";

    // Combine date and time into a single datetime string in Asia/Kolkata timezone
    const appointmentDateTime = moment
      .tz(`${date}T${time}`, "YYYY-MM-DDTHH:mm:ss", TIMEZONE)
      .toDate();

    // Get the current date and time in the specified timezone
    const currentDateTime = moment().tz(TIMEZONE).toDate();
    const today = moment().tz(TIMEZONE).startOf("day").toDate();
    const threeDaysLater = moment(today).add(3, "days").toDate();

    const dateWithTime = moment
      .tz(appointmentDateTime, "YYYY-MM-DDTHH:mm:ss", TIMEZONE)
      .toDate();
    const readableDate = moment(dateWithTime)
      .tz(TIMEZONE)
      .format("dddd, MMMM Do YYYY");
    const readableTime = moment(dateWithTime).tz(TIMEZONE).format("hh:mm A");

    // Check if the appointment date is within the next 3 days and not less than the current date
    if (appointmentDateTime < today || appointmentDateTime > threeDaysLater) {
      return res.status(400).json({
        error:
          "Appointments can only be booked from today up to 3 days in advance",
      });
    }

    // If the appointment date is today, check if the time is greater than the current time
    if (
      moment(appointmentDateTime).isSame(today, "day") &&
      moment(appointmentDateTime).isBefore(currentDateTime)
    ) {
      return res.status(400).json({
        error: "Appointment time must be greater than the current time",
      });
    }

    // Check if the appointment time is between 09:00 AM and 07:00 PM
    const appointmentHour = moment(appointmentDateTime).tz(TIMEZONE).hour();
    const appointmentMinutes = moment(appointmentDateTime)
      .tz(TIMEZONE)
      .minute();

    const isValidTime =
      (appointmentHour > 9 && appointmentHour < 19) ||
      (appointmentHour === 9 && appointmentMinutes >= 0) ||
      (appointmentHour === 19 && appointmentMinutes === 0);

    if (!isValidTime) {
      return res.status(400).json({
        error: "Appointment time must be between 09:00 AM and 07:00 PM",
      });
    }

    let hospital = await Hospital.findOne({ googlePlaceId: hospitalId });

    if (!hospital) {
      // If the hospital is not found, create a new hospital entry
      hospital = new Hospital({
        googlePlaceId: hospitalId,
        appointments: [],
      });
    } else {
      // Check if the patient has already booked an appointment in this hospital
      const hasPatientBooked = hospital.appointments.some(
        (appointment) =>
          appointment.patientId.toString() === patientId.toString()
      );

      if (hasPatientBooked) {
        return res.status(400).json({
          error: "You have already booked an appointment in this hospital",
        });
      }

      // Check if the slot is already booked
      const isSlotBooked = hospital.appointments.some(
        (appointment) =>
          new Date(appointment.date).getTime() === appointmentDateTime.getTime()
      );

      if (isSlotBooked) {
        return res.status(400).json({ error: "Slot is already booked" });
      }
    }

    const appointment = new Appointment({
      patientId,
      hospitalId,
      hospitalName,
      hospitalAddress,
      date: appointmentDateTime,
    });

    hospital.appointments.push(appointment);
    await appointment.save();
    await hospital.save();

    const appointmentMsgSent = await sendAppointmentMsg(
      req.user,
      hospitalName,
      appointmentDateTime
    );
    if (appointmentMsgSent) {
      return res.status(201).json(appointment);
    } else {
      return res.status(400).json({
        error: "Appointment booked but message not sent",
      });
    }
  } catch (error) {
    console.error("Error booking appointment:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const patientId = req.user._id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    if (appointment.patientId.toString() !== patientId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const hospital = await Hospital.findOne({
      googlePlaceId: appointment.hospitalId,
    });
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    //delete the appointment and hospital record from database
    await Appointment.findByIdAndDelete(appointmentId);
    // Check if the hospital has more than one appointment
    if (hospital.appointments.length > 1) {
      // Remove only the appointment with the matching patientId
      hospital.appointments = hospital.appointments.filter(
        (appt) => appt.patientId.toString() !== patientId.toString()
      );
      await hospital.save();
    } else {
      // If only one appointment exists, delete the entire hospital record
      await Hospital.findOneAndDelete({
        googlePlaceId: appointment.hospitalId,
      });
    }

    const cancellMsgSent = await sendCancellAppointmentMsg(
      req.user,
      appointment.hospitalName,
      appointment.date
    );

    if (cancellMsgSent) {
      return res.json({ message: "Appointment cancelled successfully" });
    } else {
      return res.status(400).json({
        error: "Appointment cancelled but message not sent",
      });
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    const { appointmentId } = req.params;
    const patientId = req.user._id;

    if (!date || !time) {
      return res.status(400).json({ error: "Date and time are required" });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.patientId.toString() !== patientId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const hospital = await Hospital.findOne({
      googlePlaceId: appointment.hospitalId,
    });

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    const TIMEZONE = "Asia/Kolkata";
    // Combine date and time into a single datetime string in Asia/Kolkata timezone
    const rescheduleDateTime = moment
      .tz(`${date}T${time}`, "YYYY-MM-DDTHH:mm:ss", TIMEZONE)
      .toDate();

    //check that new date and time should not be equal to the previous date and time
    if (rescheduleDateTime.getTime() === appointment.date.getTime()) {
      return res.status(400).json({
        error: "New appointment date and time should not be the same",
      });
    }

    // Get the current date and time in the specified timezone
    const currentDateTime = moment().tz(TIMEZONE).toDate();
    const today = moment().tz(TIMEZONE).startOf("day").toDate();
    const threeDaysLater = moment(today).add(3, "days").toDate();

    //check that current date and time is if 1hr or less than the appoinment date and time then return error
    if (
      currentDateTime.getTime() >=
      appointment.date.getTime() - 3600000 // 1hr = 3600000 milliseconds
    ) {
      return res.status(400).json({
        error:
          "Appointment can not be rescheduled within 1hr of appointment time",
      });
    }

    const dateWithTime = moment
      .tz(rescheduleDateTime, "YYYY-MM-DDTHH:mm:ss", TIMEZONE)
      .toDate();
    const readableDate = moment(dateWithTime)
      .tz(TIMEZONE)
      .format("dddd, MMMM Do YYYY");
    const readableTime = moment(dateWithTime).tz(TIMEZONE).format("hh:mm A");

    // Check if the appointment date is within the next 3 days and not less than the current date
    if (rescheduleDateTime < today || rescheduleDateTime > threeDaysLater) {
      return res.status(400).json({
        error:
          "Appointments can only be booked from today up to 3 days in advance",
      });
    }

    // If the appointment date is today, check if the time is greater than the current time
    if (
      moment(rescheduleDateTime).isSame(today, "day") &&
      moment(rescheduleDateTime).isBefore(currentDateTime)
    ) {
      return res.status(400).json({
        error: "Appointment time must be greater than the current time",
      });
    }

    // Check if the appointment time is between 09:00 AM and 07:00 PM
    const appointmentHour = moment(rescheduleDateTime).tz(TIMEZONE).hour();
    const appointmentMinutes = moment(rescheduleDateTime).tz(TIMEZONE).minute();

    const isValidTime =
      (appointmentHour > 9 && appointmentHour < 19) ||
      (appointmentHour === 9 && appointmentMinutes >= 0) ||
      (appointmentHour === 19 && appointmentMinutes === 0);

    if (!isValidTime) {
      return res.status(400).json({
        error: "Appointment time must be between 09:00 AM and 07:00 PM",
      });
    }

    // Check if the slot is already booked
    const isSlotBooked = hospital.appointments.some(
      (appointment) =>
        new Date(appointment.date).getTime() === rescheduleDateTime.getTime()
    );

    if (isSlotBooked) {
      return res.status(400).json({ error: "Slot is already booked" });
    }

    appointment.date = rescheduleDateTime;
    appointment.status = "rescheduled";
    await appointment.save();

    const rescheduleMsgSent = await sendRescheduleAppointmentMsg(
      req.user,
      appointment.hospitalName,
      rescheduleDateTime
    );

    if (rescheduleMsgSent) {
      return res.json({ message: "Appointment rescheduled successfully" });
    } else {
      return res.status(400).json({
        error: "Appointment rescheduled but message not sent",
      });
    }
  } catch (error) {
    console.error("Error rescheduling appointment:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const successPage = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findOne({ _id: appointmentId });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment on successPage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOneAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findOne({ _id: appointmentId });
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    return res.json({
      _id: appointment._id,
      hospitalId: appointment.hospitalId,
      hospitalName: appointment.hospitalName,
      hospitalAddress: appointment.hospitalAddress,
      date: appointment.date,
      status: appointment.status,
    });
  } catch (error) {
    console.error("Error fetching one appointment details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllAppointment = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const appointments = await Appointment.find({ hospitalId: hospitalId });
    if (!appointments) {
      return res.status(404).json({ error: "No appointments found" });
    }
    // Extract only the date from each appointment
    const appointmentDates = appointments.map((appointment) => ({
      date: appointment.date,
      patientId: appointment.patientId,
    }));
    return res.json(appointmentDates);
  } catch (error) {
    console.error("Error in getAllAppointment:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
