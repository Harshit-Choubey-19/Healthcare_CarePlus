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
  return (
    <Card className="max-w-sm w-full rounded overflow-hidden shadow-lg p-4 bg-white">
      <CardHeader>
        <CardTitle className="font-bold text-xl mb-2">
          {hospital?.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-base mb-2">{hospital?.address}</p>
        <p className="text-gray-700 text-base mb-2">
          Phone:&nbsp;{hospital?.phone}
        </p>
        <a
          href={hospital?.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline mb-2 block"
        >
          {hospital?.website}
        </a>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all ease-linear duration-150">
          <Link to={`/appointment/${hospital?.id}`}>Book Appointment</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
