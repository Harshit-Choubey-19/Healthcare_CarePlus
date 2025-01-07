import { AppointmentCard } from "@/components/AppointmentCard";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import React, { useEffect } from "react";

export const Appointment = () => {
  useEffect(() => {
    document.title = "CarePlus | Book your Appointment";
  });
  return (
    <div>
      <NavBar />
      <div className="m-8 flex justify-center items-center">
        <AppointmentCard />
      </div>
      <Footer />
    </div>
  );
};
