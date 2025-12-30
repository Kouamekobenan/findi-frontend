// components/DishBanner.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

interface DishItem {
  name: string;
  image: string;
}

interface DishBannerProps {
  dishes: DishItem[];
  restaurantName: string;
  // locationName?: string;
}

const DishBanner: React.FC<DishBannerProps> = ({
  dishes,
  restaurantName,
  // locationName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Animation automatique du carousel
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, dishes.length]);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? dishes.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dishes.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (!dishes || dishes.length === 0) {
    return (
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-xl shadow-lg flex items-center justify-center min-h-[200px] mb-8">
        <UtensilsCrossed size={48} className="mr-4" />
        <p className="text-xl font-semibold">
          Pas de plats disponibles pour la bannière pour l'instant.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl mb-8">
      {/* Container des images */}
      <div className="relative w-full h-full">
        {dishes.map((dish, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
            style={{
              pointerEvents: index === currentIndex ? "auto" : "none",
            }}
          >
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              className="object-cover brightness-75"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Overlay gradient pour meilleure lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Contenu superposé */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 z-10">
        <h2 className="text-3xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow-2xl">
          Explorez les saveurs inoubliables de{" "}
          <br className="hidden md:block" />
          <span className="text-orange-400 drop-shadow-lg">
            {restaurantName}
          </span>
        </h2>
        <p className="mt-4 text-base md:text-lg lg:text-xl text-gray-100 drop-shadow-lg max-w-2xl">
          Découvrez notre sélection de plats exquis.
        </p>
        <Link
          href="#dishes-section"
          scroll={true}
          className="mt-8 px-8 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
          Découvrir la carte
        </Link>
      </div>

      {/* Flèches de navigation */}
      {dishes.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/75 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 z-20"
            aria-label="Plat précédent"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/75 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 z-20"
            aria-label="Plat suivant"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Indicateurs de position */}
      {dishes.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {dishes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                currentIndex === index
                  ? "bg-orange-500 scale-125"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Aller au plat ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DishBanner;
