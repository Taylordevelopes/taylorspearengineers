"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getHeroImages } from "../lib/api/heroImages";

interface BufferImage {
  type: "Buffer";
  data: number[];
}

interface ApiSlideData {
  id: number;
  image_data: BufferImage;
  mime_type: string;
  title: string | null;
  description: string | null;
}

interface SlideData {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
}

export default function HeroSlider(): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getHeroImages();

        const formattedSlides: SlideData[] = data.images.map(
          (slide: ApiSlideData) => {
            const bytes = new Uint8Array(slide.image_data.data);

            const blob = new Blob([bytes], {
              type: slide.mime_type,
            });

            return {
              id: slide.id,
              imageUrl: URL.createObjectURL(blob),
              title: slide.title ?? "Spearitual",
              description: slide.description ?? "",
            };
          },
        );

        setSlides(formattedSlides);
      } catch (error) {
        console.error("Error fetching hero images:", error);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((previousIndex) => {
        return (previousIndex + 1) % slides.length;
      });
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    return () => {
      slides.forEach((slide) => {
        URL.revokeObjectURL(slide.imageUrl);
      });
    };
  }, [slides]);

  if (slides.length === 0) {
    return (
      <div className="w-full h-[40vh] md:h-[50vh] lg:h-[60vh] rounded-lg bg-black" />
    );
  }

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden rounded-lg border-2 border-black bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            unoptimized
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 space-x-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentIndex
                  ? "scale-125 bg-white"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
