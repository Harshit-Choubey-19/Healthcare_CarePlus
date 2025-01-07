import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdHealthAndSafety } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export const NavBar = () => {
  const queryClient = useQueryClient();

  const {
    data: authUser,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (data.error) return null;

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Redirect to login page
      toast.success("Loged out successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Failed to log out!");
    },
  });

  const handleClick = () => {
    localStorage.removeItem("userLocation");
    localStorage.removeItem("hospital");
    localStorage.removeItem("patientId");
    logoutMutation();
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center">
        <Link to="/">
          <img
            src="/assets/icons/Logo.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="h-8 w-fit"
          />
        </Link>
      </div>
      <span className="text-white text-2xl max-[669px]:hidden flex justify-center items-center gap-1">
        <FaPlusCircle className="text-red-500" />
        Health Care Management System
      </span>

      <div className="relative flex">
        <Link to="/">
          <Button className="mr-4 text-white bg-transparent border border-white hover:bg-white hover:text-blue-600 max-[298px]:hidden">
            Home
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer text-black">
              <AvatarFallback>
                {authUser?.fullName
                  ? authUser.fullName
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                  : "User"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <User />
                <Link to="/profile">
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <MdHealthAndSafety />
                <Link to="/my-appointments">
                  <span>My Appointments</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <LogOut />
              <Button
                className="bg-transparent hover:bg-transparent text-black p-0"
                onClick={handleClick}
              >
                Log out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
