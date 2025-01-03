import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 w-full shadow-xl mt-14">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <img
              src="/assets/icons/Logo.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-5 h-8 w-fit"
            />
            <p className="text-gray-400">Your health, our priority.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
            <ul className="text-gray-400">
              <li className="mb-1">
                <a href="/about" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li className="mb-1">
                <a href="/services" className="hover:text-white">
                  Services
                </a>
              </li>
              <li className="mb-1">
                <a href="/contact" className="hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-400 hover:text-white"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-white"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-white"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-400 hover:text-white"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; 2025 CarePlus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
