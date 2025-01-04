import { Footer } from "@/components/Footer";
import { ImageSlider } from "@/components/ImageSlider";
import { MainContent } from "@/components/MainContent";
import { NavBar } from "@/components/NavBar";

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
