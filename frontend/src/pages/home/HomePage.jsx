import { Footer } from "@/components/Footer";
import { ImageSlider } from "@/components/ImageSlider";
import { MainContent } from "@/components/MainContent";
import { NavBar } from "@/components/NavBar";
import React from "react";

export const HomePage = () => {
  return (
    <div>
      <NavBar />
      <ImageSlider />
      <MainContent />
      <Footer />
    </div>
  );
};
