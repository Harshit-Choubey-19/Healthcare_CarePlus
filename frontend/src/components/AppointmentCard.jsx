import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "@/common/LoadingSpinner";

export const AppointmentCard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [hospital, setHospital] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);
  const navigate = useNavigate();
  const { hospitalId } = useParams();

  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      const parsedPatientId = JSON.parse(patientId);
      setPatientId(parsedPatientId);
    }
  }, []);

  const { data: allAppointments } = useQuery({
    queryKey: ["allAppointments"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/hospitals/allAppointments/${hospitalId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      // Check if the patient has already booked an appointment
      if (
        patientId &&
        data.some((appointment) => appointment.patientId === patientId)
      ) {
        setIsAlreadyBooked(true);
      }
    },
  });

  const {
    mutate: bookAppointment,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: async ({ date, time }) => {
      try {
        const res = await fetch(
          `/api/hospitals/book-appointment/${hospitalId}?hospitalName=${hospital?.name}&hospitalAddress=${hospital?.address}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ date, time }),
          }
        );
        const data = await res.json();

        if (!res.ok && !data.message) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      // Redirect to success page with appointment details and hospitalId
      navigate("/success-page", { state: { hospitalId } });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getAvailableTimes = () => {
    const times = [];
    const currentDate = new Date(); // Get the current date and time
    const isCurrentDate =
      selectedDate?.toDateString() === currentDate.toDateString(); // Check if selected date is the current date

    const bookedTimes = allAppointments?.map((appointment) => {
      const date = new Date(appointment.date);
      return `${date.getHours()}:${
        date.getMinutes() === 0 ? "00" : date.getMinutes()
      }`;
    });

    for (let hour = 9; hour < 19; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour >= 12 && hour <= 13) continue; // Skip lunch break
        const time = `${hour}:${minute === 0 ? "00" : minute}`;

        // Skip times that are less than or equal to the current time if the selected date is the current date
        if (isCurrentDate) {
          const currentHour = currentDate.getHours();
          const currentMinute = currentDate.getMinutes();
          const isTimeInPast =
            hour < currentHour ||
            (hour === currentHour && minute <= currentMinute);

          if (isTimeInPast) {
            continue; // Skip this time slot
          }
        }

        // Check if the time is already booked
        if (!bookedTimes?.includes(time)) {
          times.push(time);
        }
      }
    }
    // Add the last time slot (19:00) only if it's not booked and the current time is not greater than 19:00
    if (isCurrentDate) {
      const currentHour = currentDate.getHours();
      const currentMinute = currentDate.getMinutes();
      const isTimeInPast =
        currentHour > 19 || (currentHour === 19 && currentMinute > 0);

      if (!isTimeInPast && !bookedTimes?.includes("19:00")) {
        times.push("19:00");
      }
    } else if (!bookedTimes?.includes("19:00")) {
      times.push("19:00");
    }

    // If no time slots are available, return an empty array
    if (times.length === 0) {
      return [];
    }

    return times;
  };

  const availableTimes = getAvailableTimes();

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }

    // Manually format the date to avoid timezone issues
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(selectedDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`; // YYYY-MM-DD format
    const formattedTime = selectedTime; // Already in HH:MM format

    bookAppointment({ date: formattedDate, time: formattedTime });
  };

  useEffect(() => {
    const hospitalFound = localStorage.getItem("hospital");
    if (hospitalFound) {
      setHospital(JSON.parse(hospitalFound));
    }
  }, []);

  const isHighlyRated = hospital?.rating > 4.5;

  return (
    <Card className="max-w-5xl w-full rounded overflow-hidden shadow-xl p-4 bg-white flex flex-col md:flex-row mt-5">
      <CardContent className="md:w-1/2 p-4">
        <CardHeader>
          <CardTitle className="font-extrabold text-xl mb-2 underline">
            {hospital?.name}
          </CardTitle>
        </CardHeader>
        <p className="text-base mb-2 font-semibold">
          Address:&nbsp;
          <span className="text-gray-700 font-normal">{hospital?.address}</span>
        </p>
        <p className="text-base mb-2 font-semibold">
          Distance:&nbsp;
          <span className="text-gray-700 font-normal italic">
            <span className="underline text-lg">{hospital?.distance}</span>
            &nbsp;from your current location
          </span>
        </p>
        <p className="text-base mb-2 font-semibold">
          Phone:&nbsp;
          <span className="text-gray-700 font-normal">
            {hospital?.contactInformation.phone}
          </span>
        </p>
        <span className="flex font-semibold">
          Website:&nbsp;{" "}
          <a
            href={hospital?.contactInformation.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mb-2 block font-normal"
          >
            {hospital?.contactInformation.website}
          </a>
        </span>
        <p className="text-base mb-2 font-semibold">
          Rating:&nbsp;
          <span className="text-gray-700 font-normal">
            {hospital?.rating}&nbsp;
            {hospital?.rating !== "N/A" && <span>/&nbsp;5</span>}
          </span>
        </p>
        {isHighlyRated && (
          <div className="bg-green-500 w-1/4 p-1 px-4 text-white rounded-full text-xs font-semibold">
            Highly Rated
          </div>
        )}
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
            Select Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 3))}
            dateFormat="MMMM d, yyyy"
            className="w-full px-3 py-2 border rounded"
            disabled={isAlreadyBooked}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="time"
          >
            Select Time
          </label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            disabled={isAlreadyBooked}
          >
            <option value="">Select Time</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all ease-linear duration-150"
            onClick={handleBookAppointment}
            disabled={isAlreadyBooked}
          >
            Book Appointment
          </Button>
        )}
        {isAlreadyBooked && (
          <div className="text-red-500 font-semibold mt-4 text-xl flex gap-4 items-center">
            Already Booked&nbsp;
            <Link to={"/my-appointments"}>
              <span className="font-normal text-base text-blue-500 hover:underline">
                Go to My Appointments
              </span>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
