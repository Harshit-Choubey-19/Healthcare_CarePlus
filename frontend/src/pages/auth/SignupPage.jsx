import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import LoadingSpinner from "@/common/LoadingSpinner";
import { Button } from "../../components/ui/button";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OtpPage } from "./OtpPage";

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [DefError, setDefError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phoneNumber) {
      setDefError(true);
    }

    if (formData.phoneNumber.length < 10) {
      setDefError(true);
    }

    setShowDialog(true);
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
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-gray-500 mb-4">HealthCare at your fingertips.</p>
            <label className="input input-bordered rounded flex items-center gap-2">
              <FaUser className="text-white" />
              <Input
                type="text"
                className="grow text-black bg-white"
                placeholder="Full Name"
                name="name"
                onChange={(e) => handleInputChange("name", e.target.value)}
                value={formData.name}
                required
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2">
              <MdOutlineMail className="text-white" />
              <Input
                type="email"
                className="grow text-black bg-white"
                placeholder="Email"
                name="email"
                onChange={(e) => handleInputChange("email", e.target.value)}
                value={formData.email}
                required
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2">
              <PhoneInput
                defaultCountry="IN"
                international
                withCountryCallingCode
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-black"
                )}
                placeholder="Phone number"
                onChange={(value) => handleInputChange("phoneNumber", value)} // Updated to handle value directly
                value={formData.phoneNumber}
                required
              />
            </label>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="submit"
                  className="shad-primary-btn w-full text-white bg-green-500 hover:bg-green-700"
                >
                  Register
                </Button>
              </DialogTrigger>
              {showDialog && (
                <DialogContent className="sm:max-w-[425px] bg-black">
                  <OtpPage />
                </DialogContent>
              )}
            </Dialog>

            {/* {isError && <p className="text-red-500">{error.message}</p>} */}
          </form>
          <div className="text-14-regular mt-11 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2025 CarePlus
            </p>
            <Link to="/login">
              <p className="text-green-500">Already registered</p>
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