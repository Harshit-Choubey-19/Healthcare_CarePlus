import { NavBar } from "@/components/NavBar";
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
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoadingSpinner from "@/common/LoadingSpinner";
import { useEffect } from "react";
import { formatDate } from "@/lib/utils/formatDate";
import { formatTime } from "@/lib/utils/formatTime";
import toast from "react-hot-toast";

export const MyAppointments = () => {
  useEffect(() => {
    document.title = "CarePlus | My Appointments";
  });
  const queryClient = useQueryClient();

  const {
    data: myAppointments,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myAppointments"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/profile/myAppointments");
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

  const { mutate: deleleAppointment, isLoading: isDeleting } = useMutation({
    mutationFn: async (appointmentId) => {
      try {
        const res = await fetch(
          `/api/hospitals/cancel-appointment/${appointmentId}`,
          {
            method: "POST",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      toast.success("Appointment cancelled!");
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
      await refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (myAppointments) {
      refetch();
    }
  }, [myAppointments, refetch]);

  const handleDelete = (appointmentId) => {
    deleleAppointment(appointmentId);
  };

  return (
    <div>
      <NavBar className="mb-4" />
      <Table className="mb-3 max-w-7xl min-w-fit mx-auto">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">Serial No</TableHead>
            <TableHead>Hospital Name</TableHead>
            <TableHead>Date and Time of Booking</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {!myAppointments || myAppointments.length === 0 ? (
              <div className="text-center py-4 text-xl">
                No appointments found
              </div>
            ) : (
              <TableBody>
                {myAppointments?.map((appointment, index) => (
                  <TableRow key={appointment._id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{appointment.hospitalName}</TableCell>
                    <TableCell>
                      {formatDate(appointment.date)}&nbsp;at&nbsp;
                      {formatTime(appointment.date)}
                    </TableCell>
                    <TableCell>{appointment?.status}</TableCell>
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
                                    <AlertDialogAction
                                      className="bg-blue-500 hover:bg-blue-700 hover:text-white"
                                      onClick={() =>
                                        handleDelete(appointment._id)
                                      }
                                    >
                                      {isDeleting ? "Loading.." : "Continue"}
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
                                to={`/rescheduleAppointment/${appointment?._id}`}
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
            )}
          </>
        )}
      </Table>
      <div className="mt-52">
        <Footer />
      </div>
    </div>
  );
};
