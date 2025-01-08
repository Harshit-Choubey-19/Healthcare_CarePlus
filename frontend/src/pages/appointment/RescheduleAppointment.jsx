import React, { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { ReschuleAppointmentCard } from "@/components/ReschuleAppointmentCard";
import { useQuery } from "react-query";
import LoadingSpinner from "@/common/LoadingSpinner";
import { useParams } from "react-router-dom";

export const RescheduleAppointment = () => {
  useEffect(() => {
    document.title = "CarePlus | Reshedule your Appointment";
  });
  const { appointmentId } = useParams();
  const { data: oneAppointment, isLoading } = useQuery({
    queryKey: ["oneAppointment"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/hospitals/appointmentDetail/${appointmentId}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  return (
    <div>
      {" "}
      <NavBar />
      <div className="m-8 flex justify-center items-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ReschuleAppointmentCard appointment={oneAppointment} />
        )}
      </div>
      <Footer />
    </div>
  );
};
