"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  Phone,
  Globe,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Restaurant } from "../../domain/entities/restaurant.entity";
import { RestaurantRepository } from "../../infrastructure/restaurant-repository";
import { FindRestaurantUsecase } from "../../application/usecases/find-restaurant.usecase";
import { descriptionApp, NameApp } from "@/app/lib/constant/constant";
import Link from "next/link";

const restauRepo = new RestaurantRepository();
const findRestaurantUsecase = new FindRestaurantUsecase(restauRepo);
export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const PER_PAGE = 10;
  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const response = await findRestaurantUsecase.execute(
          PER_PAGE,
          currentPage
        );
        setRestaurants(response.data);
        setTotalPages(response.totalPage);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, [currentPage]);
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((res) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        res.name.toLowerCase().includes(searchLower) ||
        res.country?.toLowerCase().includes(searchLower) ||
        res.country?.toLowerCase().includes(searchLower) // Ajout de la ville ici
      );
    });
  }, [restaurants, searchTerm]);
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {NameApp}
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            {descriptionApp}
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par ville ou pays..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <RestaurantSkeletonGrid />
        ) : filteredRestaurants.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((res) => (
                <RestaurantCard key={res.id} restaurant={res} />
              ))}
            </div>
            {/* Pagination... (inchangée) */}
          </>
        ) : (
          <div className="text-center py-20 text-slate-500 text-xl">
            Aucun résultat trouvé.
          </div>
        )}
      </main>
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderOpeningHours = (hours: any) => {
    if (!hours) return "Non disponible";
    try {
      const hoursObj = typeof hours === "string" ? JSON.parse(hours) : hours;
      return (
        <div className="grid grid-cols-1 gap-1 mt-1">
          {Object.entries(hoursObj).map(([day, time]) => (
            <div
              key={day}
              className="flex justify-between text-xs border-b border-slate-50 pb-1"
            >
              <span className="font-medium text-slate-700 capitalize">
                {day}
              </span>
              <span className="text-slate-500">{time as string}</span>
            </div>
          ))}
        </div>
      );
    } catch (e) {
      return String(hours);
    }
  };
  return (
    <article className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-52 w-full">
        {restaurant.image ? (
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <MapPin className="text-slate-400" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
              restaurant.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {restaurant.isActive ? "Ouvert" : "Fermé"}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            {restaurant.name}
          </h3>
          <span>
            <Link
              href={`/module/restaurantDish/views/page/${restaurant.id}`}
              className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full hover:bg-orange-700 transition-colors"
            >
              Visité
            </Link>
          </span>
        </div>

        <div className="flex items-center text-slate-500 text-xs mb-3">
          <MapPin className="w-3 h-3 mr-1 text-orange-500" />
          {restaurant.country}
        </div>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
          {restaurant.description || "Une expérience unique."}
        </p>
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
            <DetailItem
              icon={<MapPin size={16} />}
              label="Adresse"
              value={restaurant.address}
            />
            <DetailItem
              icon={<Phone size={16} />}
              label="Contact"
              value={restaurant.phone}
            />
            <DetailItem
              icon={<Clock size={16} />}
              label="Horaires"
              value={renderOpeningHours(restaurant.openingHours)}
            />
            {restaurant.website && (
              <DetailItem
                icon={<Globe size={16} />}
                label="Site Web"
                value={
                  <a
                    href={restaurant.website}
                    className="text-orange-600 hover:underline"
                  >
                    {restaurant.website}
                  </a>
                }
              />
            )}
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-5 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} /> Moins d'infos
            </>
          ) : (
            <>
              <ChevronDown size={16} /> Plus d'infos
            </>
          )}
        </button>
      </div>
    </article>
  );
}
function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) {
  return (
    <div className="flex gap-3">
      <div className="text-orange-500 shrink-0 mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 leading-none mb-1">
          {label}
        </p>
        <div className="text-sm text-slate-700">{value}</div>
      </div>
    </div>
  );
}
// Garde ta fonction RestaurantSkeletonGrid ici...
function RestaurantSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl h-[400px] animate-pulse border border-slate-100"
        >
          <div className="h-56 bg-slate-200 rounded-t-2xl" />
          <div className="p-5 space-y-4">
            <div className="h-6 bg-slate-200 w-3/4 rounded" />
            <div className="h-4 bg-slate-200 w-full rounded" />
            <div className="h-4 bg-slate-200 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
