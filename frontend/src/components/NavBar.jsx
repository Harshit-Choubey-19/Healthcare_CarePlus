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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const NavBar = () => {
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
      <span className="text-white text-2xl max-[669px]:hidden">
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
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <User />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <MdHealthAndSafety />
                <span>My Appointments</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
