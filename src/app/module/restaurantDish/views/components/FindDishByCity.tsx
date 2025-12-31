"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Store,
  Utensils,
} from "lucide-react";
import { RestaurantDishRepository } from "../../infrastructure/restaurantDish-repository";
import { FindDishByCityUsecase } from "../../application/usecases/find-dish-by-city.usecase";
import { RestaurantDish } from "../../domain/entities/restauDish.entity";
import DishBanners from "@/app/composant/banniere/BanniereDish";

// Initialisation des UseCases
const restauRepo = new RestaurantDishRepository();
const findDishByUseCase = new FindDishByCityUsecase(restauRepo);

export const DishExplorer = () => {
  // États de données
  const [dishes, setDishes] = useState<RestaurantDish[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const bannerItems = useMemo(() => {
    return dishes.slice(0, 5).map((d) => ({
      name: d.dish?.name || "",
      image: d.dish?.image || "/placeholder.png",
    }));
  }, [dishes]);

  // États de recherche
  const [cityInput, setCityInput] = useState("");
  const [activeCity, setActiveCity] = useState("");
  const [dishQuery, setDishQuery] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  // Filtrage LOCAL des plats
  const filteredDishes = useMemo(() => {
    if (!dishQuery.trim()) return dishes;
    return dishes.filter((item) =>
      item.dish?.name?.toLowerCase().includes(dishQuery.toLowerCase())
    );
  }, [dishes, dishQuery]);

  // Appel API
  useEffect(() => {
    const fetchResults = async () => {
      if (!activeCity) return;
      setLoading(true);
      try {
        const response = await findDishByUseCase.execute(
          page,
          limit,
          activeCity
        );
        setDishes(response.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [page, activeCity]);

  // Handlers
  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setActiveCity(cityInput);
      setPage(1);
      setDishQuery("");
      setHasSearched(true);
    }
  };

  const clearFilters = () => {
    setDishQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-500">
      {/* SECTION HEADER / SEARCH */}
      <section
        className={`bg-white border-b transition-all duration-700 ease-in-out ${
          !hasSearched
            ? "min-h-[60vh] sm:h-[70vh] flex items-center py-8"
            : "py-4 sm:py-6 sticky top-0 z-30 shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 w-full">
          <div
            className={`${
              !hasSearched
                ? "max-w-3xl mx-auto text-center"
                : "flex flex-col gap-4 sm:gap-6"
            }`}
          >
            {!hasSearched && (
              <div className="mb-8 sm:mb-10 animate-in fade-in zoom-in duration-700">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 px-4">
                  Qu'est-ce qu'on <span className="text-orange-500">mange</span>{" "}
                  aujourd'hui ?
                </h1>
                <p className="text-base sm:text-xl text-gray-500 px-4">
                  Trouvez les meilleurs plats autour de vous en un clic.
                </p>
              </div>
            )}

            {/* Formulaire Ville */}

            <form onSubmit={handleCitySearch} className="w-full group">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1 transition-colors group-focus-within:text-orange-500">
                Où souhaitez-vous manger ?
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  className="w-full pl-12 pr-24 sm:pr-32 py-3 sm:py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all shadow-sm text-base sm:text-lg"
                  placeholder="Entrez votre ville..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-gray-900 hover:bg-orange-600 text-white px-4 sm:px-6 rounded-xl font-bold transition-all active:scale-95 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Chercher</span>
                  <Search className="w-5 h-5 sm:hidden" />
                </button>
              </div>
            </form>

            {/* Filtre Plat Préféré */}
            {hasSearched && (
              <div className="w-full animate-in slide-in-from-right duration-500">
                <label className="block text-xs font-bold uppercase text-orange-500 mb-2 ml-1">
                  Une envie précise ?
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-20 py-3 sm:py-4 rounded-2xl border-2 border-orange-100 focus:border-orange-500 outline-none transition-all shadow-sm bg-orange-50/30 text-base sm:text-lg"
                    placeholder="Pizza, Burger, Sushi..."
                    value={dishQuery}
                    onChange={(e) => setDishQuery(e.target.value)}
                  />
                  {dishQuery && (
                    <button
                      onClick={clearFilters}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RÉSULTATS */}
      {hasSearched && (
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {!loading && bannerItems.length > 0 && (
            <DishBanners dishes={bannerItems} locationName={activeCity} />
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-10 gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Plats à{" "}
                <span className="text-orange-500 capitalize">{activeCity}</span>
              </h2>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 h-64 sm:h-96 rounded-2xl sm:rounded-3xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {filteredDishes.length > 0 ? (
                <div className="grid mb-8 md:mb-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
                  {filteredDishes.map((dish) => (
                    <article
                      key={dish.id}
                      className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-50 group flex flex-col h-full"
                    >
                      <div className="relative h-28 sm:h-56 lg:h-64 w-full overflow-hidden">
                        <Image
                          src={dish.dish?.image ?? "/placeholder.png"}
                          alt={dish.dish?.name ?? "Plat"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/95 backdrop-blur-md px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-2xl text-gray-900 font-black shadow-lg text-xs sm:text-base">
                          {dish.price} CFA
                        </div>
                      </div>

                      <div className="p-2 sm:p-6 flex flex-col flex-grow">
                        <h3 className="text-xs sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-tight">
                          {dish.dish?.name}
                        </h3>
                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-medium text-orange-600 mb-2 sm:mb-6 bg-orange-50 w-fit px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                          <Store className="w-2.5 h-2.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {dish.restaurant?.name}
                          </span>
                        </div>

                        <Link
                          href={`/module/restaurantDish/views/page/${dish.restaurant?.id}`}
                          className="mt-auto w-full text-center bg-gray-900 text-white py-2 sm:py-4 rounded-lg sm:rounded-2xl hover:bg-orange-500 transition-all font-bold shadow-md hover:shadow-orange-200 active:scale-95 text-[10px] sm:text-base"
                        >
                          <span className="hidden sm:inline">
                            Ou trouvé ce plat ?
                          </span>
                          <span className="sm:hidden">Voir</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 sm:py-32 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-inner border-2 border-dashed border-gray-100">
                  <Utensils className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 px-4">
                    Oups ! Rien ici.
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-xs mx-auto px-4">
                    Nous n'avons trouvé aucun plat correspondant à "{dishQuery}"
                    à {activeCity}.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-6 text-orange-500 font-bold hover:underline text-sm sm:text-base"
                  >
                    Voir tous les plats de la ville
                  </button>
                </div>
              )}
              {/* PAGINATION */}
              {!dishQuery && dishes.length > 10 && (
                <div className="mt-4 sm:mt-4 mb-12 md:mb-3 flex justify-center items-center gap-2 sm:gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-gray-100 bg-white font-bold hover:bg-gray-50 disabled:opacity-30 transition-all text-xs sm:text-base flex items-center gap-1 sm:gap-2"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Précédent</span>
                  </button>
                  <div className="flex gap-1">
                    <span className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-200 text-sm sm:text-base">
                      {page}
                    </span>
                  </div>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-gray-100 bg-white font-bold hover:bg-gray-50 transition-all text-xs sm:text-base flex items-center gap-1 sm:gap-2"
                  >
                    <span className="hidden sm:inline">Suivant</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      )}
    </div>
  );
};
