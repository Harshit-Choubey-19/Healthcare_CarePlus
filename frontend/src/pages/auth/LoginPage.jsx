import { useEffect, useState } from "react";
import { GiHealthNormal } from "react-icons/gi";
import { Button } from "../../components/ui/button";
import "react-phone-number-input/style.css";
import React from "react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./../../common/LoadingSpinner";

export const LoginPage = () => {
  useEffect(() => {
    document.title = "CarePlus | Login";
  });
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    patientId: "",
  });

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: async ({ patientId }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patientId }),
        });
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
      console.log(data);
      if (
        data.message === "An Otp sent to your phone please verify!" ||
        data.message ===
          "Otp already sent to your registered phone number, please verify!"
      ) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      } else {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
    console.log(formData);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex h-screen max-h-screen ml-10 max-[410px]:ml-2 max-[410px]:p-4">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <img
            src="/assets/icons/Logo.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <form
            className="space-y-6 flex-1 max-[539px]:"
            onSubmit={handleSubmit}
          >
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-gray-500 mb-4">
              Schedule your first appointment.
            </p>
            <label className="input input-bordered rounded flex items-center gap-2">
              <GiHealthNormal className="text-white" />
              <Input
                type="text"
                className="grow text-black bg-white"
                placeholder="Enter your Patient ID (e.g. CPXXXXXXXXXX)"
                name="patientId"
                onChange={(e) => handleInputChange("patientId", e.target.value)}
                value={formData.name}
                required
              />
            </label>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <Button
                type="submit"
                className="shad-primary-btn w-full text-white bg-green-500 hover:bg-green-700"
                disabled={isLoading}
              >
                Get started
              </Button>
            )}
          </form>
          <div className="text-14-regular mt-11 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2025 CarePlus
            </p>
            <Link to="/signup">
              <p className="text-green-500 hover:underline">Sign up</p>
            </Link>
          </div>
        </div>
      </section>
      <img
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%] max-[1039px]:hidden"
      />
    </div>
  );
};
