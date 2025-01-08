import React from "react";
import { useState } from "react";
import { SignupPage } from "./pages/auth/SignupPage";
import { OtpPage } from "./pages/auth/OtpPage";
import { Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { HomePage } from "./pages/home/HomePage";
import { RegistrationPage } from "./pages/registration/RegistrationPage";
import { Appointment } from "./pages/appointment/Appointment";
import { SuccessPage } from "./components/SuccessPage";
import { MyAppointments } from "./pages/appointment/MyAppointments";
import { RescheduleAppointment } from "./pages/appointment/RescheduleAppointment";
import { Profile } from "./pages/profile/Profile";
import { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";

const App = () => {
  const [check, setCheck] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (data.error) return null;

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }

        if (data.isVerified) {
          setCheck(true);
        } else {
          setCheck(false);
        }

        if (data.isRegistrationComplete) {
          setIsRegistered(true);
        } else {
          setIsRegistered(false);
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              check ? (
                isRegistered ? (
                  <HomePage />
                ) : (
                  <Navigate to="/registration" />
                )
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/verifyOtp" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/verifyOtp" />}
        />
        <Route
          path="/verifyOtp"
          element={authUser && !check ? <OtpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/registration"
          element={
            authUser && check && !isRegistered ? (
              <RegistrationPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/appointment/:hospitalId"
          element={
            authUser && check && isRegistered ? (
              <Appointment />
            ) : (
              <Navigate to="/registration" />
            )
          }
        />
        <Route
          path="/success-page"
          element={
            authUser && check && isRegistered ? (
              <SuccessPage />
            ) : (
              <Navigate to="/registration" />
            )
          }
        />
        <Route
          path="/my-appointments"
          element={
            authUser && check && isRegistered ? (
              <MyAppointments />
            ) : (
              <Navigate to="/registration" />
            )
          }
        />
        <Route
          path="/rescheduleAppointment/:appointmentId"
          element={
            authUser && check && isRegistered ? (
              <RescheduleAppointment />
            ) : (
              <Navigate to="/registration" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            authUser && check && isRegistered ? (
              <Profile />
            ) : (
              <Navigate to="/registration" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
