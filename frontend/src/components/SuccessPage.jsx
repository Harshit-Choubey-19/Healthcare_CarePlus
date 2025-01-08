import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { formatDate } from "@/lib/utils/formatDate";
import { formatTime } from "@/lib/utils/formatTime";

export const SuccessPage = () => {
  useEffect(() => {
    document.title = "CarePlus | Appointment Booked";
  });
  const location = useLocation();
  const { appointmentId } = location.state || {};
  const {
    data: appointmentSuccess,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["appointmentSuccess"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/hospitals/successPage/${appointmentId}`);
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

  useEffect(() => {
    if (appointmentSuccess) {
      refetch();
    }
  }, [appointmentSuccess, refetch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      {isLoading ? (
        <div className="bg-slate-200 p-6 rounded-lg shadow-xl text-center max-w-lg w-full">
          <img src="/assets/gifs/loading-green-loading.gif" />
          <p className="text-lg font-bold mt-4">Loading...</p>
        </div>
      ) : (
        <div className="bg-slate-200 p-6 rounded-lg shadow-xl text-center max-w-lg w-full">
          <img
            src="/assets/gifs/success.gif"
            alt="Success"
            className="w-36 h-34 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Your appointment has been booked!
          </h1>
          <p className="text-gray-700 mb-4">
            Your appointment with{" "}
            <strong>{appointmentSuccess?.hospitalName}</strong> is scheduled for{" "}
            <strong>{formatDate(appointmentSuccess?.date)}</strong> at{" "}
            <strong>{formatTime(appointmentSuccess?.date)}</strong>.
          </p>
          <p className="text-gray-700 mb-6">
            A confirmation message has been sent to your registered mobile
            number.
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Link to="/">Go to Home</Link>
            </Button>
            <Button className="bg-green-600 text-white hover:bg-green-700">
              <Link to="/my-appointments">My Appointments</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
