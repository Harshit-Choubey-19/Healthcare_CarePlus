import React, { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import "tailwindcss/tailwind.css";
import DatePicker from "react-datepicker";
import { useMutation, useQuery } from "react-query";
import { formatDate } from "@/lib/utils/formatDate";
import toast from "react-hot-toast";
import LoadingSpinner from "@/common/LoadingSpinner";
import { Separator } from "@/components/ui/separator";

export const Profile = () => {
  const [patient, setPatient] = useState({
    address: "",
    gender: "",
    occupation: "",
    allergies: "",
    medicalHistory: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    prescription: {
      doctorName: "",
      prescriptionDate: new Date(),
      comment: "",
      medicines: [],
    },
  });

  const [toUpdate, setToUpdate] = useState({});

  const {
    data: patientData,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery("patientData", async () => {
    const res = await fetch("/api/profile");
    if (!res.ok) throw new Error("Failed to fetch patient data");
    return res.json();
  });

  const { mutate: updateProfile, isLoading: isUpdating } = useMutation(
    async () => {
      const res = await fetch(`/api/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toUpdate),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong!");
      return data;
    },
    {
      onSuccess: (data) => toast.success(data.message),
      onError: (error) => toast.error(error.message),
    }
  );

  const handleChange = (field, value) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
    setToUpdate((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (field, subField, value) => {
    setPatient((prev) => ({
      ...prev,
      [field]: { ...prev[field], [subField]: value },
    }));

    setToUpdate((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] || {}), // Ensure the nested object exists
        [subField]: value,
      },
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...patient.prescription.medicines];
    updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };

    setPatient((prev) => ({
      ...prev,
      prescription: {
        ...prev.prescription,
        medicines: updatedMedicines,
      },
    }));

    setToUpdate((prev) => ({
      ...prev,
      prescription: {
        ...(prev.prescription || {}), // Ensure the nested object exists
        medicines: updatedMedicines,
      },
    }));
  };

  const addMedicine = () => {
    const newMedicines = [
      ...patient.prescription.medicines,
      { name: "", dosage: "" },
    ];
    handleNestedChange("prescription", "medicines", newMedicines);
  };

  const removeMedicine = (index) => {
    const newMedicines = patient.prescription.medicines.filter(
      (_, i) => i !== index
    );
    handleNestedChange("prescription", "medicines", newMedicines);
  };

  const handleSave = () => {
    if (Object.keys(toUpdate).length > 0) {
      updateProfile();
    } else {
      toast.info("No changes to save.");
    }
  };

  useEffect(() => {
    if (patientData) {
      setPatient(patientData);
    }
  }, [patientData]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center">
          <h1 className="text-3xl font-bold mb-4 text-white">
            Patient Profile
          </h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-black">
          <InputField label="Patient ID" value={patientData?._id} disabled />
          <InputField label="Name" value={patientData?.fullName} disabled />
          <InputField label="Email" value={patientData?.email} disabled />
          <InputField label="Phone" value={patientData?.phoneNumber} disabled />
          <InputField
            label="Address"
            value={patient.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
          <InputField label="Age" value={patientData?.age} disabled />
          <InputField
            label="DOB"
            value={formatDate(patientData?.dob)}
            disabled
          />
          <InputField label="Gender" value={patientData?.gender} disabled />
          <InputField
            label="Occupation"
            value={patient.occupation}
            onChange={(e) => handleChange("occupation", e.target.value)}
          />
          <InputField
            label="Allergies"
            value={patient.allergies}
            onChange={(e) => handleChange("allergies", e.target.value)}
          />
          <InputField
            label="Medical History"
            value={patient.medicalHistory}
            onChange={(e) => handleChange("medicalHistory", e.target.value)}
          />
          <InputField
            label="Emergency Contact Name"
            value={patient.emergencyContactName}
            onChange={(e) =>
              handleChange("emergencyContactName", e.target.value)
            }
          />
          <InputField
            label="Emergency Contact Number"
            value={patient.emergencyContactNumber}
            onChange={(e) =>
              handleChange("emergencyContactNumber", e.target.value)
            }
          />
          <Separator className="mt-8" />
          <Label className="block text-gray-700 font-bold mb-2 text-xl mt-3">
            Prescription
          </Label>
          <div className="mb-4">
            <Label
              htmlFor="prescription-date"
              className="block text-gray-700 font-bold mb-2 mt-4"
            >
              Prescription Date
            </Label>
            <DatePicker
              selected={new Date(patient?.prescription?.prescriptionDate)}
              onChange={(date) =>
                handleNestedChange("prescription", "prescriptionDate", date)
              }
              dateFormat="MMMM d, yyyy"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <InputField
            label="Comment"
            value={patient?.prescription?.comment}
            onChange={(e) =>
              handleNestedChange("prescription", "comment", e.target.value)
            }
          />
          <InputField
            label="Doctor Name"
            value={patient?.prescription?.doctorName}
            onChange={(e) =>
              handleNestedChange("prescription", "doctorName", e.target.value)
            }
          />
          {patient?.prescription?.medicines.map((medicine, index) => (
            <div key={index} className="mb-4 flex items-center">
              <Input
                type="text"
                placeholder="Medicine Name"
                value={medicine?.name}
                onChange={(e) =>
                  handleMedicineChange(index, "name", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <Input
                type="text"
                placeholder="Dosage"
                value={medicine?.dosage}
                onChange={(e) =>
                  handleMedicineChange(index, "dosage", e.target.value)
                }
                className="w-1/4 p-2 border border-gray-300 rounded ml-2"
              />
              <Button
                onClick={() => removeMedicine(index)}
                className="ml-2 bg-red-500 text-white hover:bg-red-600"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            onClick={addMedicine}
            className="w-1/4 bg-green-500 text-white hover:bg-green-700"
          >
            Add Medicine
          </Button>
          <div className="mt-6">
            {isUpdating ? (
              <LoadingSpinner />
            ) : (
              <Button
                onClick={handleSave}
                className="w-full bg-blue-500 text-white hover:bg-blue-700"
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const InputField = ({ label, value, onChange, disabled }) => (
  <div className="mb-4">
    <Label className="block text-gray-700 font-bold mb-2">{label}</Label>
    <Input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>
);
