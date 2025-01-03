import React, { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import cn from "classnames";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaTimes } from "react-icons/fa";
import { Footer } from "@/components/Footer";
// import { Prescription } from "@/components/Prescription";

export const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+919129100552",
    gender: "",
    dob: "",
    address: "",
    occupation: "",
    medicalHistory: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    allergies: "",
    identificationType: "",
    identificationNumber: "",
    privacyConsent: false,
    prescriptions: "",
  });

  const [medicinesData, setMedicinesData] = useState([""]);
  const [prescriptionData, setPrescriptionData] = useState({
    prescriptionDate: "",
    doctorName: "",
    medicines: [],
    comment: "",
  });

  const handlePrescriptionInputChange = (field, value) => {
    setPrescriptionData({ ...prescriptionData, [field]: value });
  };

  const handleMedicineChange = (index, value) => {
    const newMedicines = [...medicinesData];
    newMedicines[index] = value;
    setMedicinesData(newMedicines);
  };

  const addMedicineField = () => {
    setMedicinesData([...medicinesData, ""]);
  };

  const removeMedicineField = (index) => {
    const newMedicines = medicinesData.filter((_, i) => i !== index);
    setMedicinesData(newMedicines);
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    setPrescriptionData((prevData) => ({
      ...prevData,
      medicines: medicinesData,
    }));
    console.log("Prescription Data:", {
      ...prescriptionData,
      medicines: medicinesData,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      prescriptions: prescriptionData,
    }));
    console.log("Form Data:", {
      ...formData,
      prescriptions: prescriptionData,
    });

    console.log("FORM DATA", formData);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 text-white">
        <div>
          <img
            src="/assets/icons/Logo.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-5 h-8 w-fit"
          />
          <h1 className="text-4xl font-bold mb-6 text-center">Registration</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 ">Full Name</label>
              <Input
                type="text"
                value={formData.fullName}
                disabled
                className="w-full text-white bg-black"
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                disabled
                className="w-full text-white bg-black"
              />
            </div>
            <div>
              <label className="block mb-2">Phone Number</label>
              <PhoneInput
                defaultCountry="IN"
                international
                withCountryCallingCode
                value={formData.phoneNumber}
                onChange={(value) => handleInputChange("phoneNumber", value)}
                disabled
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-black px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-white"
                )}
                style={{
                  backgroundColor: "black", // Ensures the entire background is black
                }}
              />
            </div>
            <div>
              <label className="block mb-2">Gender</label>
              <Select
                onValueChange={(value) => handleInputChange("gender", value)}
                className="w-full text-white bg-black"
              >
                <SelectTrigger className="w-[180px] text-white bg-black">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Gender</SelectLabel>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Date of Birth</label>
              <Input
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
                className="w-full text-white bg-black"
              />
            </div>
            <div>
              <label className="block mb-2">Address</label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full text-white bg-black"
              />
            </div>
            <div>
              <label className="block mb-2">Occupation</label>
              <Input
                type="text"
                value={formData.occupation}
                onChange={(e) =>
                  handleInputChange("occupation", e.target.value)
                }
                className="w-full text-white bg-black"
              />
            </div>
            <div>
              <label className="block mb-2">Medical History</label>
              <Textarea
                value={formData.medicalHistory}
                onChange={(e) =>
                  handleInputChange("medicalHistory", e.target.value)
                }
                className="w-full text-white bg-black"
              />
            </div>
            <div>
              <label className="block mb-2">Emergency Contact Name</label>
              <Input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  handleInputChange("emergencyContactName", e.target.value)
                }
                className="w-full text-white bg-black"
              />
            </div>
            <div>
              <label className="block mb-2">Emergency Contact Number</label>
              <PhoneInput
                defaultCountry="IN"
                international
                withCountryCallingCode
                value={formData.emergencyContactNumber}
                onChange={(value) =>
                  handleInputChange("emergencyContactNumber", value)
                }
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-black"
                )}
              />
            </div>
            <div>
              <label className="block mb-2">Allergies</label>
              <Textarea
                value={formData.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                className="w-full text-white bg-black"
              />
            </div>
            <div>
              <label className="block mb-2">Identification Type</label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("identificationType", value)
                }
                className="w-full text-white bg-black"
              >
                <SelectTrigger className="w-[180px] text-white bg-black">
                  <SelectValue placeholder="Select Identification Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Identification</SelectLabel>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="driving license">
                      Driving License
                    </SelectItem>
                    <SelectItem value="aadhar">Aadhar</SelectItem>
                    <SelectItem value="other government id">
                      Other Government ID
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Identification Number</label>
              <Input
                type="text"
                value={formData.identificationNumber}
                onChange={(e) =>
                  handleInputChange("identificationNumber", e.target.value)
                }
                className="w-full text-white bg-black"
              />
            </div>
            <div>
              <label className="block mb-2">Prescriptions</label>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="text-black">
                    Edit Prescriptions
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-black text-white">
                  <div className="max-h-screen overflow-y-auto p-4">
                    <SheetHeader>
                      <SheetTitle className="text-white">
                        Edit Prescription
                      </SheetTitle>
                      <SheetDescription>
                        Update your prescription details here.
                      </SheetDescription>
                    </SheetHeader>
                    <form className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="prescriptionDate" className="">
                          Prescription Date
                        </Label>
                        <Input
                          id="prescriptionDate"
                          type="date"
                          value={prescriptionData.prescriptionDate}
                          onChange={(e) =>
                            handlePrescriptionInputChange(
                              "prescriptionDate",
                              e.target.value
                            )
                          }
                          className="col-span-3 bg-black text-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="doctorName" className="">
                          Doctor Name
                        </Label>
                        <Input
                          id="doctorName"
                          type="text"
                          value={prescriptionData.doctorName}
                          onChange={(e) =>
                            handlePrescriptionInputChange(
                              "doctorName",
                              e.target.value
                            )
                          }
                          className="col-span-3 bg-black text-white"
                        />
                      </div>
                      {medicinesData.map((medicine, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 items-center gap-4"
                        >
                          <Label htmlFor={`medicine-${index}`} className="">
                            Medicine {index + 1}
                          </Label>
                          <div className="col-span-3 flex items-center">
                            <Input
                              id={`medicine-${index}`}
                              type="text"
                              value={medicine}
                              onChange={(e) =>
                                handleMedicineChange(index, e.target.value)
                              }
                              className="bg-black text-white flex-grow"
                            />
                            {index === medicinesData.length - 1 && (
                              <Button
                                type="button"
                                onClick={() => removeMedicineField(index)}
                                className="ml-2 bg-red-500 hover:bg-red-700 text-white"
                              >
                                <FaTimes />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={addMedicineField}
                          className="bg-blue-500 hover:bg-blue-700 text-white"
                        >
                          Add Medicine
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="comment" className="">
                          Comment
                        </Label>
                        <Textarea
                          id="comment"
                          value={prescriptionData.comment}
                          onChange={(e) =>
                            handlePrescriptionInputChange(
                              "comment",
                              e.target.value
                            )
                          }
                          className="col-span-3 bg-black text-white"
                        />
                      </div>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button
                            className="bg-green-500 hover:bg-green-700 text-white"
                            onClick={handlePrescriptionSubmit}
                          >
                            Save
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </form>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                className=" border-white"
                checked={formData.privacyConsent} // Bind checked state
                onCheckedChange={(value) =>
                  handleInputChange("privacyConsent", value)
                }
              />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-1/3 bg-green-500 hover:bg-green-700 text-white"
            >
              Register
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};
