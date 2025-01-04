import { NavBar } from "@/components/NavBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FaEllipsisV } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";
import { Footer } from "@/components/Footer";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";

const appointments = [
  {
    id: 1,
    hospitalName: "Hospital A",
    hospitalId: 1,
    bookingDateTime: "2023-10-01 10:00 AM",
  },
  {
    id: 2,
    hospitalName: "Hospital B",
    hospitalId: 2,
    bookingDateTime: "2023-10-02 11:00 AM",
  },
  // Add more appointments as needed
];

export const MyAppointments = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();

  const getAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour < 19; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour >= 12 && hour <= 13) continue; // Skip lunch break
        const time = `${hour}:${minute === 0 ? "00" : minute}`;
        times.push(time);
      }
    }
    times.push("19:00"); // Add the last time slot
    return times;
  };

  const availableTimes = getAvailableTimes();

  const handleRescheduleAppointment = () => {};

  return (
    <div>
      <NavBar className="mb-4" />
      <Table className="mb-3 max-w-7xl min-w-fit mx-auto">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">Serial No</TableHead>
            <TableHead>Hospital Name</TableHead>
            <TableHead>Date and Time of Booking</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment, index) => (
            <TableRow key={appointment.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{appointment.hospitalName}</TableCell>
              <TableCell>{appointment.bookingDateTime}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-transparent w-0 hover:bg-transparent">
                      {" "}
                      <FaEllipsisV
                        className="inline-block text-white hover:text-gray-800 cursor-pointer text-lg"
                        title="Options"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={(event) => event.preventDefault()} // Prevent the dropdown from closing
                      >
                        <MdCancel />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <span>Cancel Appointment</span>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-black z-[1050]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently cancel your appointment.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-red-500 hover:bg-red-700 hover:text-white">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction className="bg-blue-500 hover:bg-blue-700 hover:text-white">
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={(event) => event.preventDefault()}
                      >
                        <GrPowerReset />
                        <Link
                          to={`/rescheduleAppointment/${appointment?.hospitalId}`}
                        >
                          <span>Reschedule Appointment</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-44">
        <Footer />
      </div>
    </div>
  );
};
