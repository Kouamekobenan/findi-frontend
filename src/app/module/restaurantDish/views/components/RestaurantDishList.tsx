// pages/module/restaurants/views/[id].tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Utensils,
  Loader2,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import { RestaurantDishRepository } from "../../infrastructure/restaurantDish-repository";
import { FindRestauDishUseCase } from "../../application/usecases/find-restauDish.usecase";
import { RestaurantDish } from "../../domain/entities/restauDish.entity";
import DishBanner from "@/app/composant/banniere/Banniere";

const restauDishRepo = new RestaurantDishRepository();
const findRestauDishUseCase = new FindRestauDishUseCase(restauDishRepo);

export default function RestaurantDishList() {
  const [restaurantDishes, setRestaurantDishes] = useState<RestaurantDish[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantDish = async (id: string) => {
      try {
        const response = await findRestauDishUseCase.execute(id);
        const dishes = Array.isArray(response) ? response : [response];
        setRestaurantDishes(dishes);
      } catch (error) {
        console.error("Error fetching restaurant dish:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantDish(id);
  }, [id]);

  // Filtrage des plats basé sur la recherche
  const filteredDishes = useMemo(() => {
    if (!searchQuery.trim()) {
      return restaurantDishes;
    }

    const query = searchQuery.toLowerCase();
    return restaurantDishes.filter((item) => {
      const dishName = item.dish?.name?.toLowerCase() || "";
      const dishDescription = item.dish?.description?.toLowerCase() || "";
      const itemDescription = item.description?.toLowerCase() || "";
      const category = item.dish?.category?.toLowerCase() || "";

      return (
        dishName.includes(query) ||
        dishDescription.includes(query) ||
        itemDescription.includes(query) ||
        category.includes(query)
      );
    });
  }, [restaurantDishes, searchQuery]);

  const renderOpeningHours = (hoursJson: any) => {
    try {
      const hours =
        typeof hoursJson === "string" ? JSON.parse(hoursJson) : hoursJson;
      return Object.entries(hours).map(([day, time]: [string, any]) => (
        <div
          key={day}
          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
        >
          <span className="capitalize font-medium text-gray-700 text-sm">
            {day}
          </span>
          <span className="text-gray-900 text-sm font-semibold">{time}</span>
        </div>
      ));
    } catch (e) {
      return (
        <p className="text-gray-500 italic text-sm">Horaires non disponibles</p>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto" />
          <p className="text-gray-600 font-medium">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (!restaurantDishes || restaurantDishes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">
            Restaurant introuvable
          </h2>
          <p className="text-gray-600">
            Aucun plat disponible pour ce restaurant.
          </p>
        </div>
      </div>
    );
  }

  const firstItem = restaurantDishes[0];
  const restaurant = firstItem.restaurant;

  const bannerDishes = restaurantDishes
    .filter((item) => item.dish?.image)
    .map((item) => ({
      name: item.dish?.name || "Plat inconnu",
      image: item.dish?.image || "/placeholder.jpg",
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8">
        {/* BANNIÈRE */}
        <DishBanner
          dishes={bannerDishes}
          restaurantName={restaurant?.name || "Restaurant"}
        />

        {/* HEADER RESTAURANT */}
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image du restaurant */}
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px]">
              <Image
                src={restaurant?.image || "/placeholder.jpg"}
                alt={restaurant?.name || "Restaurant"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />
            </div>

            {/* Informations du restaurant */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-6">
              {/* Nom et description */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {restaurant?.name}
                </h1>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {restaurant?.description}
                </p>
              </div>

              {/* Coordonnées */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                  <span className="text-sm sm:text-base">
                    {restaurant?.address}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <a
                    href={`tel:${restaurant?.phone}`}
                    className="text-sm sm:text-base hover:text-orange-500 transition-colors"
                  >
                    {restaurant?.phone}
                  </a>
                </div>

                {restaurant?.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 hover:underline text-sm sm:text-base transition-colors"
                    >
                      Visiter le site web
                    </a>
                  </div>
                )}
              </div>

              {/* Horaires d'ouverture */}
              {restaurant?.openingHours && (
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-5 rounded-xl border border-orange-100">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base sm:text-lg">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Horaires d'ouverture
                  </h4>
                  <div className="space-y-1">
                    {renderOpeningHours(restaurant.openingHours)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION PLATS */}
        <section id="dishes-section" className="scroll-mt-20">
          <div className="space-y-6">
            {/* En-tête avec recherche */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Utensils className="w-7 h-7 text-orange-500" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Notre carte
                </h2>
              </div>

              {/* Barre de recherche */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un plat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Résultats de recherche */}
            {searchQuery && (
              <div className="text-sm text-gray-600">
                {filteredDishes.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-700">
                      Aucun plat trouvé pour "{searchQuery}"
                    </p>
                    <p className="text-gray-500 mt-1">
                      Essayez avec un autre terme de recherche
                    </p>
                  </div>
                ) : (
                  <p>
                    <span className="font-semibold text-orange-600">
                      {filteredDishes.length}
                    </span>{" "}
                    plat{filteredDishes.length > 1 ? "s" : ""} trouvé
                    {filteredDishes.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}

            {/* Grille de plats */}
            {filteredDishes.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredDishes.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300"
                  >
                    {/* Image du plat */}
                    <div className="relative h-28 sm:h-52 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={item.dish?.image || "/placeholder.jpg"}
                        alt={item.dish?.name || "Plat"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Badge indisponible */}
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full text-sm">
                            Indisponible
                          </span>
                        </div>
                      )}

                      {/* Badge catégorie */}
                      {item.dish?.category && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            {item.dish.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Informations du plat */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {item.dish?.name}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[40px]">
                        {item.description ||
                          item.dish?.description ||
                          "Délicieux plat préparé avec soin"}
                      </p>

                      {/* Prix */}
                      <div className="pt-0 border-t border-gray-100">
                        <span className="text-2xl font-bold text-green-600">
                          {item.price}{" "}
                          <span className="text-base">{item.currency}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer optionnel */}
        <div className="text-center py-8 text-gray-500 text-sm">
          <p>Bon appétit ! 🍽️</p>
        </div>
      </div>
    </div>
  );
}
