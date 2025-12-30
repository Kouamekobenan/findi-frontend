"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DishItem {
  name: string;
  image: string;
}
interface DishBannerProps {
  dishes: DishItem[];
  locationName?: string;
}

const DishBanners: React.FC<DishBannerProps> = ({ dishes, locationName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (dishes.length <= 1) return;
    const interval = setInterval(() => goToNext(), 5000);
    return () => clearInterval(interval);
  }, [currentIndex, dishes.length]);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? dishes.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % dishes.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (!dishes || dishes.length === 0) return null;

  return (
    /* ✅ Hauteur réduite : de h-[450px] à h-[280px] sur PC */
    <div className="relative w-full h-[220px] md:h-[280px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-lg mb-8 animate-in fade-in duration-1000">
      {/* Images */}
      <div className="absolute inset-0">
        {dishes.map((dish, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              className="object-cover brightness-[0.7]" // ✅ Légèrement moins sombre pour voir mieux l'image
              priority
            />
          </div>
        ))}
      </div>

      {/* Overlay Gradient plus discret */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      {/* ✅ Contenu réaligné à gauche pour un look plus "Header" moderne */}
      <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-8 md:px-16 z-10">
        <span className="bg-orange-500 text-white px-3 py-0.5 rounded-full text-[10px] md:text-xs font-bold mb-2 uppercase tracking-wider">
          Nouveau à {locationName || "votre région"}
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-white leading-tight drop-shadow-md max-w-2xl">
          Les pépites culinaires de <br />
          <span className="text-orange-400">
            {locationName ? locationName : "votre ville"}
          </span>
        </h2>
        <p className="mt-2 text-gray-200 text-sm md:text-base max-w-md font-medium hidden sm:block">
          Découvrez les plats les plus plébiscités ce mois-ci.
        </p>
      </div>
      {/* Boutons Nav plus petits et collés aux bords */}
      {dishes.length > 1 && (
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between z-20">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-orange-500 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-orange-500 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
      {/* Indicateurs (Dots) en bas au centre */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {dishes.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex ? "w-6 bg-orange-500" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DishBanners;
