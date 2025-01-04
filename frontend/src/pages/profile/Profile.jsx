import React, { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import "tailwindcss/tailwind.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

export const Profile = () => {
  const [patient, setPatient] = useState({
    id: "12345",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    age: 30,
    dob: "1991-01-01",
    gender: "Male",
    occupation: "Software Engineer",
    allergies: "None",
    medicalHistory: "No significant history",
    emergencyContactName: "Jane Doe",
    emergencyContactNumber: "098-765-4321",
    identificationType: "aadhar",
    identificationNumber: "D1234567",
    prescription: {
      doctorName: "Dr. Smith",
      medicines: ["Medicine 1", "Medicine 2"],
    },
  });

  const [toUpdate, setToUpdate] = useState({});

  const handleChange = (field, value) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      [field]: value,
    }));
    setToUpdate((prevToUpdate) => ({
      ...prevToUpdate,
      [field]: value,
    }));
  };

  const handleMedicineChange = (index, value) => {
    const newMedicines = [...patient.prescription.medicines];
    newMedicines[index] = value;
    setPatient((prevPatient) => ({
      ...prevPatient,
      prescription: {
        ...prevPatient.prescription,
        medicines: newMedicines,
      },
    }));
    setToUpdate((prevToUpdate) => ({
      ...prevToUpdate,
      prescription: {
        ...prevToUpdate.prescription,
        medicines: newMedicines,
      },
    }));
  };

  const addMedicine = () => {
    const newMedicines = [...patient.prescription.medicines, ""];
    setPatient((prevPatient) => ({
      ...prevPatient,
      prescription: {
        ...prevPatient.prescription,
        medicines: newMedicines,
      },
    }));
    setToUpdate((prevToUpdate) => ({
      ...prevToUpdate,
      prescription: {
        ...prevToUpdate.prescription,
        medicines: newMedicines,
      },
    }));
  };

  const removeMedicine = (index) => {
    const newMedicines = patient.prescription.medicines.filter(
      (_, i) => i !== index
    );
    setPatient((prevPatient) => ({
      ...prevPatient,
      prescription: {
        ...prevPatient.prescription,
        medicines: newMedicines,
      },
    }));
    setToUpdate((prevToUpdate) => ({
      ...prevToUpdate,
      prescription: {
        ...prevToUpdate.prescription,
        medicines: newMedicines,
      },
    }));
  };

  const handleSave = () => {
    console.log("Updated changes to be saved", toUpdate);
  };

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-white">Patient Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg text-black">
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">
              Patient ID
            </Label>
            <Input
              type="text"
              name="id"
              value={patient.id}
              onChange={handleChange}
              disabled
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">Name</Label>
            <Input
              type="text"
              name="name"
              value={patient.name}
              onChange={handleChange}
              disabled
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">Email</Label>
            <Input
              type="text"
              name="email"
              value={patient.email}
              onChange={handleChange}
              disabled
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">Phone</Label>
            <Input
              type="text"
              name="phone"
              value={patient.phone}
              onChange={handleChange}
              disabled
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">
              Address
            </Label>
            <Input
              type="text"
              name="address"
              value={patient.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">Age</Label>
            <Input
              type="text"
              name="age"
              value={patient.age}
              onChange={handleChange}
              disabled
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">DOB</Label>
            <Input
              type="text"
              name="dob"
              value={patient.dob}
              onChange={handleChange}
              disabled
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">Gender</Label>
            <Input
              type="text"
              name="gender"
              value={patient.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">
              Occupation
            </Label>
            <Input
              type="text"
              name="occupation"
              value={patient.occupation}
              onChange={(e) => handleChange("occupation", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">
              Allergies
            </Label>
            <Input
              type="text"
              name="allergies"
              value={patient.allergies}
              onChange={(e) => handleChange("allergies", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">
              Medical History
            </Label>
            <Input
              type="text"
              name="medicalHistory"
              value={patient.medicalHistory}
              onChange={(e) => handleChange("medicalHistory", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">
              Emergency Contact Name
            </Label>
            <Input
              type="text"
              name="emergencyContactName"
              value={patient.emergencyContactName}
              onChange={(e) =>
                handleChange("emergencyContactName", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">
              Emergency Contact Number
            </Label>
            <Input
              type="text"
              name="emergencyContactNumber"
              value={patient.emergencyContactNumber}
              onChange={(e) =>
                handleChange("emergencyContactNumber", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">
              Identification Type
            </Label>
            <Select
              name="identificationType"
              value={patient.identificationType}
              onValueChange={(value) =>
                handleChange("identificationType", value)
              }
              className="w-full text-black"
            >
              <SelectTrigger className="w-[180px] text-black">
                <SelectValue
                  placeholder="Select Identification Type"
                  className="text-black"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-black">
                    Identification
                  </SelectLabel>
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
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">
              Identification Number
            </Label>
            <Input
              type="text"
              name="identificationNumber"
              value={patient.identificationNumber}
              onChange={(e) =>
                handleChange("identificationNumber", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700 font-bold mb-2">
              Prescription
            </Label>
            <div className="mb-4">
              <Label className="block text-gray-700 font-bold mb-2">
                Doctor Name
              </Label>
              <Input
                type="text"
                name="doctorName"
                value={patient.prescription.doctorName}
                onChange={(e) =>
                  handleChange("prescription", {
                    ...patient.prescription,
                    doctorName: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            {patient.prescription.medicines.map((medicine, index) => (
              <div key={index} className="mb-4 flex items-center">
                <Input
                  type="text"
                  name={`medicine-${index}`}
                  value={medicine}
                  onChange={(e) => handleMedicineChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <Button
                  onClick={() => removeMedicine(index)}
                  className="ml-2 bg-red-500 text-white"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              onClick={addMedicine}
              className="w-1/4 bg-green-500 text-white max-[464px]:text-xs"
            >
              Add Medicine
            </Button>
          </div>
          <div className="mt-6">
            <Button
              className="w-full bg-blue-500 text-white"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
