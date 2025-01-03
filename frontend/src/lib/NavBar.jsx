import React, { useState } from "react";
import { Menu, MenuItem, MenuButton } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Image from "next/image";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Image src="/carplus.png" alt="CarPlus" width={50} height={50} />
        <span className="ml-2 text-xl font-bold text-gray-800">CarPlus</span>
      </div>
      <div className="relative">
        <Menu>
          <MenuButton
            className="flex items-center focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <img
              src="/profile-icon.png"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <ChevronDownIcon className="w-5 h-5 ml-2" />
          </MenuButton>
          {isOpen && (
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    My Profile
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    My Appointments
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Logout
                  </a>
                )}
              </MenuItem>
            </Menu.Items>
          )}
        </Menu>
      </div>
    </nav>
  );
};