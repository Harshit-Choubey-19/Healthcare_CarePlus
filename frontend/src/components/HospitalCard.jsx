import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const HospitalCard = ({ hospital }) => {
  const handleStorageSave = () => {
    localStorage.setItem("hospital", JSON.stringify(hospital));
  };

  const isHighlyRated = hospital?.rating > 4.5;

  return (
    <Card className="max-w-sm w-full rounded overflow-hidden shadow-lg p-4 bg-white relative hover:scale-105 transform transition-all ease-linear duration-300">
      {/* Highly Rated Badge */}
      {isHighlyRated && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          Highly Rated
        </div>
      )}

      <CardHeader>
        <CardTitle className="font-bold text-xl mb-2">
          {hospital?.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Address */}
        <p className="text-base mb-2 font-semibold">
          Address:&nbsp;
          <span className="text-gray-700 font-normal">{hospital?.address}</span>
        </p>

        {/* Distance */}
        <p className="text-base mb-2 font-semibold">
          Distance:&nbsp;
          <span className="text-gray-700 font-normal italic">
            <span className="underline text-lg">{hospital?.distance}</span>
            &nbsp;from your current location
          </span>
        </p>

        {/* Phone */}
        <p className="text-base mb-2 font-semibold">
          Phone:&nbsp;
          <span className="text-gray-700 font-normal">
            {hospital?.contactInformation.phone}
          </span>
        </p>

        {/* Website */}
        <span className="flex font-semibold">
          Website:&nbsp;{" "}
          <a
            href={hospital?.contactInformation?.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mb-2 block font-normal"
          >
            {hospital?.contactInformation?.website}
          </a>
        </span>

        {/* Rating */}
        <p className="text-base mb-2 font-semibold">
          Rating:&nbsp;
          <span className="text-gray-700 font-normal">
            {hospital?.rating}&nbsp;
            {hospital?.rating !== "N/A" && <span>/&nbsp;5</span>}
          </span>
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all ease-linear duration-150"
          onClick={handleStorageSave}
        >
          <Link to={`/appointment/${hospital?.id}`}>Book Appointment</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
