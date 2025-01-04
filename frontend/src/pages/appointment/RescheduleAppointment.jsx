import React from "react";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { ReschuleAppointmentCard } from "@/components/ReschuleAppointmentCard";

export const RescheduleAppointment = () => {
  return (
    <div>
      {" "}
      <NavBar />
      <div className="m-8 flex justify-center items-center">
        <ReschuleAppointmentCard />
      </div>
      <Footer />
    </div>
  );
};
