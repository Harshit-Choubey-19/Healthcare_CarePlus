import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

export const ReschuleAppointmentCard = ({ hospital }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();

  const getAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour < 19; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour >= 12 && hour <= 13) continue; // Skip lunch break
        const time = `${hour}:${minute === 0 ? "00" : minute}`;
        times.push(time);
      }
    }
    times.push("19:00"); // Add the last time slot
    return times;
  };

  const availableTimes = getAvailableTimes();

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }
  };

  return (
    <Card className="max-w-5xl w-full rounded overflow-hidden shadow-xl p-4 bg-white flex flex-col md:flex-row mt-5">
      <CardContent className="md:w-1/2 p-4">
        <CardHeader>
          <CardTitle className="font-bold text-xl mb-2">
            {hospital?.name}
          </CardTitle>
        </CardHeader>
        <p className="text-gray-700 text-base mb-2">{hospital?.address}</p>
        <p className="text-gray-700 text-base mb-2">Phone: {hospital?.phone}</p>
        <p className="text-gray-700 text-base mb-2">
          Booked on: {hospital?.date} at {hospital?.time}
        </p>
        <a
          href={hospital?.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline mb-2 block"
        >
          {hospital?.website}
        </a>
      </CardContent>
      <CardContent className="md:w-1/2 p-4">
        <div className="mb-4">
          <span className="font-bold">NOTE:</span>
          <span className="text-gray-700 text-sm font-semibold mb-3 italic">
            &nbsp;Slot booking time is from 9:00 AM to 7:00 PM
          </span>
          <label
            className="block text-gray-700 text-sm font-bold mt-2 mb-2"
            htmlFor="date"
          >
            Select New Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 3))}
            dateFormat="MMMM d, yyyy"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="time"
          >
            Select New Time
          </label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Time</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <Button
          className="w-full bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all ease-linear duration-150"
          onClick={handleBookAppointment}
        >
          Reschedule Appointment
        </Button>
      </CardContent>
    </Card>
  );
};
