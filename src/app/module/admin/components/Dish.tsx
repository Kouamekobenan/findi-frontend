"use client";
import React, { useEffect, useState } from "react";
import { Trash2, Edit, Plus, Loader2, Search, X } from "lucide-react";
import { Dish } from "../../dish/domain/entities/dish.entity";
import { DishRepository } from "../../dish/infrastructure/dish-repository";
import { FindAllDishUsecase } from "../../dish/application/usecasese/find-all-dish.usecase";
import { api } from "@/app/prisma/api";

const dishRep = new DishRepository();
const findAllDishUsecase = new FindAllDishUsecase(dishRep);
interface updateDto {
  name: string;
  description: string;
  category: string;
}

export default function DishPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // États pour le Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDish, setCurrentDish] = useState<Partial<Dish> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDishData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await findAllDishUsecase.execute();
      setDishes(response);
    } catch (err) {
      setError("Erreur lors de la récupération des plats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishData();
  }, []);

  // Gestion Modal
  const openModal = (dish: Dish | null = null) => {
    setCurrentDish(dish || { name: "", description: "", category: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDish(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentDish?.id) {
        // Mode Update
        await api.patch(`/dish/${currentDish.id}`, currentDish);
      } else {
        // Mode Create

        await api.post("/dish", currentDish);
      }
      fetchDishData();
      closeModal();
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce plat ?")) return;
    try {
      await api.delete(`/dish/${id}`);
      setDishes(dishes.filter((dish) => dish.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch =
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || dish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(dishes.map((d) => d.category).filter(Boolean))),
  ];

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* En-tête Responsive */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Gestion des Plats
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Administrez votre menu
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="w-full sm:w-[200px] flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Nouveau plat
            </button>
          </div>
        </div>

        {/* Barre de recherche et Filtres (Stack on mobile) */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un plat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-64 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="all">Toutes les catégories</option>
              {categories
                .filter((c) => c !== "all")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Grille des Plats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-5 hover:shadow-md transition-all"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                    {dish.name}
                  </h3>
                  <span className="px-2 py-1 bg-orange-50 text-orange-700 text-[10px] font-bold uppercase rounded-md tracking-wider">
                    {dish.category || "Menu"}
                  </span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button
                  onClick={() => openModal(dish)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4" /> Modifier
                </button>
                <button
                  onClick={() => handleDelete(dish.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL (Create/Edit) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {currentDish?.id ? "Modifier le plat" : "Ajouter un plat"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Nom du plat
                  </label>
                  <input
                    required
                    value={currentDish?.name || ""}
                    onChange={(e) =>
                      setCurrentDish({ ...currentDish, name: e.target.value })
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Ex: Tiep Bou Dien"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Catégorie
                  </label>
                  <input
                    required
                    value={currentDish?.category || ""}
                    onChange={(e) =>
                      setCurrentDish({
                        ...currentDish,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Ex: Entrées, Plats de résistance..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={currentDish?.description || ""}
                    onChange={(e) =>
                      setCurrentDish({
                        ...currentDish,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Détails du plat, allergènes..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Chargement..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
