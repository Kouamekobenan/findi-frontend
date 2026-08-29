"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { FindDishByDishNameUsecase } from "../../application/usecases/find-restaurant-by-dish.usecase";
import { DishRepository } from "@/app/module/dish/infrastructure/dish-repository";
import { FindAllLinkedDishUsecase } from "@/app/module/dish/application/usecasese/find-all-linked-dish.usecase";
import { Dish } from "@/app/module/dish/domain/entities/dish.entity";
import { RestaurantRepository } from "@/app/module/restaurants/infrastructure/restaurant-repository";
import { FindRestaurantUsecase } from "@/app/module/restaurants/application/usecases/find-restaurant.usecase";
import { safeImageUrl } from "@/app/module/common/safe-image-url";

// Initialisation des UseCases
const restauRepo = new RestaurantDishRepository();
const findDishByUseCase = new FindDishByDishNameUsecase(restauRepo);
const dishRepo = new DishRepository();
const findAllLinkedDishUsecase = new FindAllLinkedDishUsecase(dishRepo);
const restaurantRepo = new RestaurantRepository();
const findRestaurantUsecase = new FindRestaurantUsecase(restaurantRepo);

export const DishExplorer = () => {
  // États de données
  const [dishes, setDishes] = useState<RestaurantDish[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const bannerItems = useMemo(() => {
    return dishes.slice(0, 5).map((d) => ({
      name: d.dish?.name || "",
      image: safeImageUrl(d.dish?.image, "/placeholder.png"),
    }));
  }, [dishes]);

  // États de recherche - INVERSÉS
  const [dishInput, setDishInput] = useState(""); // Plat principal
  const [activeDish, setActiveDish] = useState(""); // Plat actif pour la recherche
  const [cityQuery, setCityQuery] = useState(""); // Filtre ville (secondaire)
  const [page, setPage] = useState(1);

  // Combobox ville
  const cityFieldRef = useRef<HTMLDivElement>(null);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [highlightedCityIndex, setHighlightedCityIndex] = useState(-1);
  const [allCities, setAllCities] = useState<string[]>([]);

  // Suggestions de plats cliquables (catalogue)
  const [suggestedDishes, setSuggestedDishes] = useState<Dish[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const limit = 10;

  // Chargement des suggestions de plats depuis la base
  useEffect(() => {
    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const allDishes = await findAllLinkedDishUsecase.execute();
        setSuggestedDishes(allDishes || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des suggestions :", err);
      } finally {
        setSuggestionsLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  // Chargement de toutes les villes disponibles (tous restaurants confondus)
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await findRestaurantUsecase.execute(500, 1);
        const unique = new Set<string>();
        (response.data || []).forEach((restaurant) => {
          const country = restaurant.country?.trim();
          if (country) unique.add(country);
        });
        setAllCities(Array.from(unique).sort((a, b) => a.localeCompare(b)));
      } catch (err) {
        console.error("Erreur lors de la récupération des villes :", err);
      }
    };
    fetchCities();
  }, []);

  // Filtrage LOCAL par ville
  const filteredDishes = useMemo(() => {
    const trimmedQuery = cityQuery.trim().toLowerCase();
    if (!trimmedQuery) return dishes;

    return dishes.filter((item) =>
      item.restaurant?.country.toLowerCase().includes(trimmedQuery),
    );
  }, [dishes, cityQuery]);

  // Filtrage du combobox ville : recherche texte en plus du défilement de la liste
  const filteredCityOptions = useMemo(() => {
    const trimmedQuery = cityQuery.trim().toLowerCase();
    if (!trimmedQuery) return allCities;
    return allCities.filter((city) =>
      city.toLowerCase().includes(trimmedQuery),
    );
  }, [allCities, cityQuery]);

  // Fermeture du dropdown ville au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cityFieldRef.current &&
        !cityFieldRef.current.contains(event.target as Node)
      ) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Appel API basé sur le plat
  useEffect(() => {
    const fetchResults = async () => {
      if (!activeDish) return;
      setLoading(true);
      try {
        const response = await findDishByUseCase.execute(
          page,
          limit,
          activeDish, // Passer le plat au lieu de la ville
        );
        setDishes(response.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [page, activeDish]);

  // Handlers
  const triggerSearch = (name: string) => {
    if (!name.trim()) return;
    setDishInput(name);
    setActiveDish(name);
    setPage(1);
    setCityQuery("");
    setHasSearched(true);
  };

  const handleDishSearch = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(dishInput);
  };

  const handleSuggestionClick = (dish: Dish) => {
    triggerSearch(dish.name);
  };

  const clearFilters = () => {
    setCityQuery("");
    setIsCityDropdownOpen(false);
    setHighlightedCityIndex(-1);
  };

  const selectCity = (city: string) => {
    setCityQuery(city);
    setIsCityDropdownOpen(false);
    setHighlightedCityIndex(-1);
  };

  const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isCityDropdownOpen || filteredCityOptions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedCityIndex((prev) =>
        Math.min(prev + 1, filteredCityOptions.length - 1),
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedCityIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (
        highlightedCityIndex >= 0 &&
        filteredCityOptions[highlightedCityIndex]
      ) {
        e.preventDefault();
        selectCity(filteredCityOptions[highlightedCityIndex]);
      }
    } else if (e.key === "Escape") {
      setIsCityDropdownOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-500">
      {/* SECTION HEADER / SEARCH */}
      <section
        className={`relative overflow-hidden bg-white border-b transition-all duration-700 ease-in-out ${
          !hasSearched
            ? "min-h-[52vh] sm:min-h-[60vh] lg:min-h-[65vh] flex items-center py-10 sm:py-14"
            : "py-3 sm:py-5 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95"
        }`}
      >
        {!hasSearched && (
          <>
            <div className="pointer-events-none absolute -top-24 -right-16 w-64 h-64 sm:w-96 sm:h-96 bg-orange-200/40 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-16 w-64 h-64 sm:w-96 sm:h-96 bg-orange-100/60 rounded-full blur-3xl" />
          </>
        )}

        <div className="relative container mx-auto px-4 sm:px-6 w-full">
          <div
            className={`${
              !hasSearched
                ? "max-w-2xl mx-auto text-center"
                : "max-w-5xl mx-auto flex flex-col gap-3"
            }`}
          >
            {!hasSearched && (
              <div className="mb-6 sm:mb-8 animate-in fade-in zoom-in duration-700">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 sm:mb-3 px-4 tracking-tight">
                  Qu'est-ce qu'on{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                    mange
                  </span>{" "}
                  aujourd'hui ?
                </h1>
                <p className="text-sm sm:text-base text-gray-500 px-4">
                  Tapez le nom d'un plat ou choisissez une suggestion ci-dessous.
                </p>
              </div>
            )}

            {/* Barre de recherche */}
            <div
              className={
                hasSearched
                  ? "flex flex-col sm:flex-row gap-2.5 sm:gap-3"
                  : "w-full"
              }
            >
              {/* Formulaire Plat - PRINCIPAL */}
              <form
                onSubmit={handleDishSearch}
                className={hasSearched ? "sm:flex-[1.2] min-w-0" : "w-full"}
              >
                {!hasSearched && (
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">
                    Quel plat souhaitez-vous manger ?
                  </label>
                )}
                <div
                  className={`group relative flex items-center bg-white border-2 border-gray-100 focus-within:border-orange-500 transition-all ${
                    hasSearched
                      ? "rounded-2xl"
                      : "rounded-full shadow-lg shadow-orange-100/60"
                  }`}
                >
                  <Utensils
                    className={`absolute text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none ${
                      hasSearched ? "left-4 w-4 h-4 sm:w-5 sm:h-5" : "left-5 w-5 h-5"
                    }`}
                  />
                  <input
                    type="text"
                    className={`w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 ${
                      hasSearched
                        ? "pl-11 sm:pl-12 pr-12 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base"
                        : "pl-14 pr-28 sm:pr-36 py-4 sm:py-5 rounded-full text-base sm:text-lg"
                    }`}
                    placeholder="Pizza, Burger, Sushi..."
                    value={dishInput}
                    onChange={(e) => setDishInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    aria-label="Rechercher"
                    className={`absolute cursor-pointer flex items-center justify-center bg-gray-900 hover:bg-orange-600 text-white font-bold transition-all active:scale-95 ${
                      hasSearched
                        ? "right-1.5 w-8 h-8 sm:w-9 sm:h-9 rounded-xl"
                        : "right-2 gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-sm sm:text-base"
                    }`}
                  >
                    {hasSearched ? (
                      <Search className="w-4 h-4" />
                    ) : (
                      <>
                        <span className="hidden sm:inline">Chercher</span>
                        <Search className="w-5 h-5 sm:hidden" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Filtre Ville - SECONDAIRE, cote à cote avec le plat */}
              {hasSearched && (
                <div
                  className="sm:flex-1 min-w-0 animate-in fade-in slide-in-from-right-2 duration-500"
                  ref={cityFieldRef}
                >
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                    <input
                      type="text"
                      role="combobox"
                      aria-expanded={isCityDropdownOpen}
                      aria-autocomplete="list"
                      autoComplete="off"
                      className="w-full pl-11 sm:pl-12 pr-10 py-3 sm:py-3.5 rounded-2xl border-2 border-orange-100 focus:border-orange-500 outline-none transition-all bg-orange-50/40 text-sm sm:text-base placeholder:text-gray-400"
                      placeholder="Ville : Abidjan, Bouaké..."
                      value={cityQuery}
                      onChange={(e) => {
                        setCityQuery(e.target.value);
                        setIsCityDropdownOpen(true);
                        setHighlightedCityIndex(-1);
                      }}
                      onFocus={() => setIsCityDropdownOpen(true)}
                      onKeyDown={handleCityKeyDown}
                    />
                    {cityQuery && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}

                    {isCityDropdownOpen && filteredCityOptions.length > 0 && (
                      <ul className="absolute left-0 right-0 z-40 mt-2 max-h-60 overflow-y-auto rounded-2xl border-2 border-orange-100 bg-white shadow-lg py-2">
                        {filteredCityOptions.map((city, index) => (
                          <li key={city}>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => selectCity(city)}
                              className={`w-full cursor-pointer text-left px-4 py-2 sm:py-2.5 text-sm sm:text-base capitalize transition-colors ${
                                index === highlightedCityIndex
                                  ? "bg-orange-50 text-orange-600"
                                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                              }`}
                            >
                              {city}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions de plats - choix par clic sur une image */}
            {!hasSearched &&
              (suggestionsLoading || suggestedDishes.length > 0) && (
                <div className="mt-8 sm:mt-10 animate-in fade-in duration-700">
                  <p className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-wide">
                    Ou choisissez parmi nos suggestions
                  </p>
                  {suggestionsLoading ? (
                    <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 px-1 justify-center">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-2 shrink-0"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 animate-pulse" />
                          <div className="w-12 h-3 rounded bg-gray-200 animate-pulse" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 px-1 justify-start sm:justify-center">
                      {suggestedDishes.map((dish) => (
                        <button
                          key={dish.id}
                          type="button"
                          onClick={() => handleSuggestionClick(dish)}
                          className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
                        >
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-orange-500 shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 group-active:scale-95 transition-all">
                            <Image
                              src={safeImageUrl(dish.image, "/placeholder.png")}
                              alt={dish.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-orange-500 capitalize max-w-20 truncate">
                            {dish.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </section>
      {/* RÉSULTATS */}
      {hasSearched && (
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {!loading && bannerItems.length > 0 && (
            <DishBanners dishes={bannerItems} locationName={activeDish} />
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-10 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
                <span className="text-orange-500 capitalize">{activeDish}</span>
                {cityQuery && (
                  <span className="text-gray-600">
                    {" "}
                    à{" "}
                    <span className="text-orange-500 capitalize">
                      {cityQuery}
                    </span>
                  </span>
                )}
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
                      className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-gray-50 group flex flex-col h-full"
                    >
                      <div className="relative h-28 sm:h-56 lg:h-64 xl:h-72 w-full overflow-hidden">
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
                          <Store className="w-2.5 h-2.5 sm:w-4 sm:h-4 shrink-0" />
                          <span className="line-clamp-1">
                            {dish.restaurant?.name}
                          </span>
                        </div>

                        <Link
                          href={`/module/restaurantDish/views/page/${dish.restaurant?.id}`}
                          className="mt-auto w-full text-center bg-gray-900 text-white py-2 sm:py-4 rounded-lg sm:rounded-2xl hover:bg-orange-500 transition-all font-bold shadow-md hover:shadow-orange-200 active:scale-95 text-[10px] sm:text-base"
                        >
                          <span className="hidden sm:inline">
                            Où trouver ce plat ?
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
                    Nous n'avons trouvé aucun "{activeDish}"
                    {cityQuery && ` à ${cityQuery}`}.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-6 cursor-pointer text-orange-500 font-bold hover:underline text-sm sm:text-base"
                  >
                    Voir tous les résultats
                  </button>
                </div>
              )}
              {/* PAGINATION */}
              {!cityQuery && dishes.length > 10 && (
                <div className="mt-4 sm:mt-4 mb-12 md:mb-3 flex justify-center items-center gap-2 sm:gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-gray-100 bg-white font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs sm:text-base flex items-center gap-1 sm:gap-2"
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
                    className="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-gray-100 bg-white font-bold hover:bg-gray-50 transition-all text-xs sm:text-base flex items-center gap-1 sm:gap-2"
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
