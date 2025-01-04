import React from "react";
import { SignupPage } from "./pages/auth/SignupPage";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { HomePage } from "./pages/home/HomePage";
import { RegistrationPage } from "./pages/registration/RegistrationPage";
import { Appointment } from "./pages/appointment/Appointment";
import { SuccessPage } from "./components/SuccessPage";
import { MyAppointments } from "./pages/appointment/MyAppointments";
import { RescheduleAppointment } from "./pages/appointment/RescheduleAppointment";
import { Profile } from "./pages/profile/Profile";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/appointment/:hospitalId" element={<Appointment />} />
        <Route path="/success-page" element={<SuccessPage />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route
          path="/rescheduleAppointment/:hospitalId"
          element={<RescheduleAppointment />}
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
