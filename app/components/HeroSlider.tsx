import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { getHeroImages } from "../lib/api/heroImages";

interface SlideData {
  id: number;
  image: StaticImageData;
  title: string;
  description: string;
}

export default function HeroSlider(): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [slides, setSlides] = useState<SlideData[]>([]);

  // Fetch slides data from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getHeroImages();
        setSlides(data);
      } catch (error) {
        console.error("Error fetching hero images:", error);
      }
    };

    fetchSlides();
  }, []);

  // Optional: Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden bg-black border-2 border-black  rounded-lg">
      {/* Slides Container */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Next.js Optimized Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
          />

          {/* Dark Overlay */}

          {/* Centered Captions */}
        </div>
      ))}

      {/* Navigation Indicators (Dots) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3 z-40">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
