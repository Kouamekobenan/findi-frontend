"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ExternalLink,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";
import { RestaurantRepository } from "../../restaurants/infrastructure/restaurant-repository";
import { FindRestaurantUsecase } from "../../restaurants/application/usecases/find-restaurant.usecase";
import { Restaurant } from "../../restaurants/domain/entities/restaurant.entity";

import { api } from "@/app/prisma/api";
import toast from "react-hot-toast";

const restauRepo = new RestaurantRepository();
const findRestaurantUsecase = new FindRestaurantUsecase(restauRepo);

export default function RestaurantAdmin() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const PER_PAGE = 9; // Grid de 3 colonnes

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
      toast.error("Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [currentPage]);

  const filteredRestaurants = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return restaurants.filter(
      (res) =>
        res.name.toLowerCase().includes(searchLower) ||
        res.country?.toLowerCase().includes(searchLower)
      // res.city?.toLowerCase().includes(searchLower)
    );
  }, [restaurants, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header "Dashboard Style" */}
      <header className="bg-white border-b border-slate-200 pt-16 pb-12 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-10 h-10 text-orange-600" />
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Console Administration
            </h1>
          </div>
          <p className="text-slate-500 mb-8 max-w-lg text-center font-medium">
            Validation et gestion des établissements partenaires
          </p>

          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Filtrer par nom, ville ou pays..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all shadow-sm bg-white text-slate-700"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <RestaurantSkeletonGrid />
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((res) => (
              <RestaurantCard
                key={res.id}
                restaurant={res}
                onStatusChange={fetchRestaurants}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">
              Aucun restaurant ne correspond à votre recherche.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function RestaurantCard({
  restaurant,
  onStatusChange,
}: {
  restaurant: Restaurant;
  onStatusChange: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      // On active à la fois le restaurateur (User) et le restaurant
      await Promise.all([
        api.patch(`/users/${restaurant.userId}`),
        api.patch(`/restaurant/activate/${restaurant.id}`),
      ]);
      toast.success(`${restaurant.name} est maintenant activé !`);
      onStatusChange();
    } catch (error) {
      toast.error("Échec de l'activation");
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <article className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:border-orange-200 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-500">
      {" "}
      <div className="relative h-40 w-full group overflow-hidden bg-slate-100">
        <Image
          src={restaurant.image || "/placeholder-restaurant.jpg"}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${
              restaurant.isActive
                ? "bg-emerald-500/90 text-white"
                : "bg-rose-500/90 text-white"
            }`}
          >
            {restaurant.isActive ? "Activé" : "En attente"}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center text-slate-400 text-xs font-bold mt-1">
              <MapPin className="w-3 h-3 mr-1 text-orange-500" />
              {restaurant.country}
            </div>
          </div>
          <Link
            href={`/module/restaurantDish/views/page/${restaurant.id}`}
            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all shadow-sm"
          >
            <ExternalLink size={18} />
          </Link>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-1 italic">
          {restaurant.description || "Pas de description fournie."}
        </p>
        {isExpanded && (
          <div className="space-y-4 py-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
            <DetailItem
              icon={<ShieldCheck size={16} />}
              label="ID Propriétaire"
              value={restaurant.userId}
            />
            <DetailItem
              icon={<Phone size={16} />}
              label="Téléphone"
              value={restaurant.phone}
            />
            <DetailItem
              icon={<Clock size={16} />}
              label="Horaires"
              value={
                <div className="mt-2">
                  {renderHours(restaurant.openingHours)}
                </div>
              }
            />
          </div>
        )}

        <div className="mt-auto space-y-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors uppercase tracking-widest"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} /> Réduire
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Détails Techniques
              </>
            )}
          </button>

          {/* BOUTON D'ACTIVATION ADMIN */}
          {!restaurant.isActive && (
            <button
              onClick={handleActivate}
              disabled={isActivating}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70"
            >
              {isActivating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle size={20} /> Valider l'établissement
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// Fonction Helper pour les heures
function renderHours(hours: any) {
  const hoursObj = typeof hours === "string" ? JSON.parse(hours) : hours;
  if (!hoursObj) return "N/A";
  return (
    <div className="grid grid-cols-1 gap-1.5">
      {Object.entries(hoursObj).map(([day, time]) => (
        <div
          key={day}
          className="flex justify-between text-[11px] text-slate-500 border-b border-slate-50 pb-1"
        >
          <span className="capitalize font-semibold">{day}</span>
          <span>{time as string}</span>
        </div>
      ))}
    </div>
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
    <div className="flex gap-3 items-start">
      <div className="text-orange-500 mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
          {label}
        </p>
        <div className="text-sm text-slate-700 font-medium break-all">
          {value}
        </div>
      </div>
    </div>
  );
}

function RestaurantSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-3xl h-[500px] animate-pulse border border-slate-100 shadow-sm"
        />
      ))}
    </div>
  );
}
