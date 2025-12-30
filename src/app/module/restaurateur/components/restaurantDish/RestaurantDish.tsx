"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Utensils,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";

// ... (tes imports de repositories et usecases restent identiques)
import { RestaurantDishRepository } from "@/app/module/restaurantDish/infrastructure/restaurantDish-repository";
import { FindRestauDishUseCase } from "@/app/module/restaurantDish/application/usecases/find-restauDish.usecase";
import { RestaurantDish } from "@/app/module/restaurantDish/domain/entities/restauDish.entity";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { DeleteRestaurantDishUsecase } from "@/app/module/restaurantDish/application/usecases/delete-restaurantDish.usecase";
import { UpdateRestaurantDishUsecase } from "@/app/module/restaurantDish/application/usecases/update-restaurantDish.usecase";
import { UpdateRestaurantDishDto } from "@/app/module/restaurantDish/application/dtos/update.dto";
import toast from "react-hot-toast";

const restauDishRepo = new RestaurantDishRepository();
const findRestauDishUseCase = new FindRestauDishUseCase(restauDishRepo);
const deleteRestauDishUseCase = new DeleteRestaurantDishUsecase(restauDishRepo);
const updateRestauDishUseCase = new UpdateRestaurantDishUsecase(restauDishRepo);

export default function RestaurantDashboard() {
  const [restaurantDishes, setRestaurantDishes] = useState<RestaurantDish[]>(
    []
  );
  const { user } = useAuth();
  const restaurId = user?.restaurants?.[0]?.id;
  const [loading, setLoading] = useState(true);

  // ÉTAT POUR LA MODIFICATION
  const [editingDish, setEditingDish] = useState<RestaurantDish | null>(null);
  const [editForm, setEditForm] = useState<UpdateRestaurantDishDto>({
    price: 0,
    isAvailable: false,
  });

  useEffect(() => {
    if (restaurId) fetchDishes();
  }, [restaurId]);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const response = await findRestauDishUseCase.execute(restaurId!);
      const dishes = Array.isArray(response) ? response : [response];
      setRestaurantDishes(dishes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // OUVRE LE FORMULAIRE DE MODIFICATION
  const startEdit = (dish: RestaurantDish) => {
    setEditingDish(dish);
    setEditForm({ price: dish.price, isAvailable: dish.isAvailable });
  };

  const handleUpdate = async () => {
    if (!editingDish) return;
    try {
      await updateRestauDishUseCase.execute(editingDish.id, editForm);
      toast.success("Plat modifié avec succès");
      setEditingDish(null);
      fetchDishes();
    } catch (error) {
      alert("Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce plat ?")) {
      await deleteRestauDishUseCase.execute(id);
      setRestaurantDishes((prev) => prev.filter((d) => d.id !== id));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-orange-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* MODAL DE MODIFICATION RAPIDE */}
      {editingDish && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Modifier le plat
              </h2>
              <button onClick={() => setEditingDish(null)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix ({editingDish.currency})
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Disponible à la vente
                </span>
                <button
                  onClick={() =>
                    setEditForm({
                      ...editForm,
                      isAvailable: !editForm.isAvailable,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    editForm.isAvailable ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editForm.isAvailable ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={handleUpdate}
                className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Confirmer les changements
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-white border-b px-4 sm:px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-gray-800">
          <Utensils className="text-orange-500" /> Gestion Carte
        </h1>
        <Link
          href="/module/restaurateur/views/restauDish/create"
          className="bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Nouveau Plat</span>
          <span className="sm:hidden">Nouveau</span>
        </Link>
      </header>
      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* VUE GRILLE POUR MOBILE (2 colonnes) */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {restaurantDishes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="relative h-28">
                <Image
                  src={item.dish?.image || "/placeholder.jpg"}
                  alt="plat"
                  fill
                  className={`object-cover ${
                    !item.isAvailable ? "grayscale opacity-50" : ""
                  }`}
                />
                <div className="absolute top-1 right-1 flex gap-1">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1.5 bg-white rounded-full shadow-md text-gray-700 hover:text-orange-600"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-bold text-gray-900 text-xs mb-1 truncate">
                  {item.dish?.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 font-black text-sm">
                    {item.price} {item.currency}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      item.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.isAvailable ? "Actif" : "Masqué"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* VUE TABLEAU POUR DESKTOP */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nom du plat
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {restaurantDishes.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.dish?.image || "/placeholder.jpg"}
                        alt="plat"
                        fill
                        className={`object-cover ${
                          !item.isAvailable ? "grayscale opacity-50" : ""
                        }`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {item.dish?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-orange-600 font-black text-lg">
                      {item.price} {item.currency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        item.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.isAvailable ? "Actif" : "Masqué"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 bg-orange-50 rounded-lg text-orange-600 hover:bg-orange-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-50 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
