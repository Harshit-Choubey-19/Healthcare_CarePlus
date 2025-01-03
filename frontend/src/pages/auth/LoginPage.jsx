import { useState } from "react";
import { GiHealthNormal } from "react-icons/gi";
import LoadingSpinner from "@/common/LoadingSpinner";
import { Button } from "../../components/ui/button";
import "react-phone-number-input/style.css";
import React from "react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    patientId: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // loginMutation(formData);
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
            <Button
              type="submit"
              className="shad-primary-btn w-full text-white bg-green-500 hover:bg-green-700"
            >
              Get started
            </Button>
            {/* {isError && <p className="text-red-500">{error.message}</p>} */}
          </form>
          <div className="text-14-regular mt-11 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2025 CarePlus
            </p>
            <Link to="/signup">
              <p className="text-green-500">Sign up</p>
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
