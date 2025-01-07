import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import "tailwindcss/tailwind.css";
import Autoplay from "embla-carousel-autoplay";

export const ImageSlider = () => {
  const images = [
    "/assets/images/hospital1.jpg",
    "/assets/images/hospital2.avif",
    "/assets/images/hospital3.jpg",
    "/assets/images/imag4.webp",
  ];

  const plugin = React.useRef(Autoplay({ delay: 3000 }));

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 rounded-lg overflow-hidden shadow-lg">
      <Carousel
        className="relative w-full h-[500px]"
        plugins={[plugin.current]}
      >
        <CarouselContent className="w-full h-full">
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="w-full h-full border-0 shadow-none">
                <CardContent className="p-0">
                  <img
                    src={image}
                    alt={`Hospital ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 text-black rounded-full p-2 hover:bg-white" />
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 text-black rounded-full p-2 hover:bg-white" />
      </Carousel>
    </div>
  );
};
