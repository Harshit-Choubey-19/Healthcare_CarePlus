import { Footer } from "@/components/Footer";
import { ImageSlider } from "@/components/ImageSlider";
import { MainContent } from "@/components/MainContent";
import { NavBar } from "@/components/NavBar";
import { useEffect } from "react";

export const HomePage = () => {
  useEffect(() => {
    document.title = "CarePlus | A Healthcare Management App";
  });
  return (
    <div>
      <NavBar />
      <ImageSlider />
      <MainContent />
      <Footer />
    </div>
  );
};
