"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/app/context/AuthContext";
import { Save, Upload, MapPin, Phone, Globe, Clock, Store } from "lucide-react";
import { RestaurantRepository } from "@/app/module/restaurants/infrastructure/restaurant-repository";
import { UpdateRestaurantUseCase } from "@/app/module/restaurants/application/usecases/update-restaurant.usecase";

// Schéma de validation aligné sur ton DTO
const restaurantSchema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  description: z.string().optional(),
  address: z.string().min(5, "L'adresse est requise"),
  phone: z.string().min(8, "Numéro invalide"),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  openingHours: z.record(z.string(), z.string()).optional(),
});
const restauRepo = new RestaurantRepository();
const updateRestaurantUseCase = new UpdateRestaurantUseCase(restauRepo);

type RestaurantFormValues = z.infer<typeof restaurantSchema>;
export default function ParametrageRestaurant() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const restaurant = user?.restaurants?.[0];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: restaurant?.name || "",
      description: restaurant?.description || "",
      address: restaurant?.address || "",
      phone: restaurant?.phone || "",
      website: restaurant?.website || "",
      openingHours: restaurant?.openingHours || {},
    },
  });

  // Gestion de la prévisualisation de l'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: RestaurantFormValues) => {
    if (!restaurant?.id) return;
    setLoading(true);
    try {
      // Ton service update que nous avons corrigé précédemment
      // await restaurantService.update(restaurant.id, data, selectedFile);
      await updateRestaurantUseCase.execute(restaurant.id, data, selectedFile);
      console.log("Données envoyées:", data, selectedFile);
      alert("Paramètres mis à jour !");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <Store className="text-orange-500" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Paramètres du Restaurant
          </h1>
          <p className="text-gray-500 text-sm">
            Gérez les informations visibles par vos clients
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SECTION IMAGE */}
        <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-6">
          <div className="relative w-32 h-32 bg-gray-200 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
            {imagePreview || restaurant?.image ? (
              <img
                src={imagePreview || restaurant?.image}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Upload />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo de couverture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* INFOS GÉNÉRALES */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Store size={18} /> Général
            </h3>

            <div>
              <label className="text-sm font-medium">Nom du restaurant</label>
              <input
                {...register("name")}
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          {/* CONTACT & LOC */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin size={18} /> Contact & Localisation
            </h3>

            <div>
              <label className="text-sm font-medium">Adresse</label>
              <input
                {...register("address")}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-1">
                  <Phone size={14} /> Téléphone
                </label>
                <input
                  {...register("phone")}
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-1">
                  <Globe size={14} /> Site Web
                </label>
                <input
                  {...register("website")}
                  className="w-full mt-1 p-2 border rounded-md"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION HORAIRES (Simplified) */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock size={18} /> Horaires d'ouverture
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              "Lundi",
              "Mardi",
              "Mercredi",
              "Jeudi",
              "Vendredi",
              "Samedi",
              "Dimanche",
            ].map((day) => (
              <div key={day}>
                <label className="text-xs text-gray-500">{day}</label>
                <input
                  placeholder="08:00-22:00"
                  className="w-full p-2 text-sm border rounded-md bg-white"
                  onChange={(e) => {
                    const hours = {
                      ...restaurant?.openingHours,
                      [day.toLowerCase()]: e.target.value,
                    };
                    setValue("openingHours", hours);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            {loading ? (
              "Chargement..."
            ) : (
              <>
                <Save size={20} /> Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
