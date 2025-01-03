import React from "react";
import { SignupPage } from "./pages/auth/SignupPage";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { HomePage } from "./pages/home/HomePage";
import { RegistrationPage } from "./pages/registration/RegistrationPage";
import { Appointment } from "./pages/appointment/Appointment";
import { SuccessPage } from "./components/SuccessPage";

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
      </Routes>
    </div>
  );
};

export default App;
