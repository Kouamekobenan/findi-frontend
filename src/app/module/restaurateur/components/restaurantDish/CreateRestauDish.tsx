"use client";

import React, { useEffect, useState } from "react";
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Loader2,
  UtensilsCrossed,
  Tag,
  FileText,
  ImageIcon,
} from "lucide-react";
import { CreateDishDto } from "@/app/module/restaurantDish/application/dtos/createDish.dto";
import { Dish } from "@/app/module/dish/domain/entities/dish.entity";
import { DishRepository } from "@/app/module/dish/infrastructure/dish-repository";
import { FindAllDishUsecase } from "@/app/module/dish/application/usecasese/find-all-dish.usecase";
import { useAuth } from "@/app/context/AuthContext";
import { RestaurantDishRepository } from "@/app/module/restaurantDish/infrastructure/restaurantDish-repository";
import { CreateRestauDishUseCase } from "@/app/module/restaurantDish/application/usecases/create-restauDish.usecase";
import { UpdateDishUsecae } from "@/app/module/dish/application/usecasese/dish-update.usecase";

interface SubmitStatus {
  type: "success" | "error";
  message: string;
}

const RestaurantDishForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateDishDto>({
    restaurantId: "",
    dishId: "",
    price: 0,
    currency: "Fcfa",
    description: "",
    isAvailable: true,
  });

  const [repositories] = useState(() => ({
    dishRepo: new DishRepository(),
    restauDishRepo: new RestaurantDishRepository(),
  }));

  const [useCases] = useState(() => ({
    findAllDish: new FindAllDishUsecase(repositories.dishRepo),
    updateDish: new UpdateDishUsecae(repositories.dishRepo),
    createRestauDish: new CreateRestauDishUseCase(repositories.restauDishRepo),
  }));

  const [customImage, setCustomImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoadingDishes, setIsLoadingDishes] = useState<boolean>(true);

  const { user } = useAuth();
  const restaurantId = user?.restaurants?.[0]?.id || "";

  const fetchDishData = async (): Promise<void> => {
    try {
      setIsLoadingDishes(true);
      const res = await useCases.findAllDish.execute();
      setDishes(res);
    } catch (error) {
      console.error("Erreur lors de la récupération des plats:", error);
      setSubmitStatus({
        type: "error",
        message: "Impossible de charger le catalogue de plats.",
      });
    } finally {
      setIsLoadingDishes(false);
    }
  };

  useEffect(() => {
    fetchDishData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price"
            ? parseFloat(value) || 0
            : value,
    }));
  };

  const handleDishSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedDishId = e.target.value;
    const selectedDish = dishes.find((d) => d.id === selectedDishId);

    setFormData((prev) => ({
      ...prev,
      dishId: selectedDishId,
      description: selectedDish?.description || "",
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (): void => {
    setCustomImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.dishId) {
      setSubmitStatus({
        type: "error",
        message: "Veuillez sélectionner un plat.",
      });
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setSubmitStatus({
        type: "error",
        message: "Veuillez saisir un tarif valide.",
      });
      return;
    }
    if (!formData.description.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Une description du plat est requise.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await useCases.createRestauDish.execute({
        ...formData,
        restaurantId,
      });

      if (customImage) {
        await useCases.updateDish.execute(
          formData.dishId,
          { description: formData.description },
          customImage,
        );
      }

      setSubmitStatus({
        type: "success",
        message: "Plat ajouté au menu avec succès !",
      });

      setTimeout(() => {
        setFormData({
          restaurantId: "",
          dishId: "",
          price: 0,
          currency: "Fcfa",
          description: "",
          isAvailable: true,
        });
        setCustomImage(null);
        setImagePreview(null);
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 lg:p-10 transition-all">
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 mb-4">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Ajouter un Plat au Menu
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Personnalisez les offres tarifaires et la carte de votre
              établissement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélection du Plat */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                <UtensilsCrossed className="w-4 h-4 text-slate-400" />
                Sélectionner un Plat
              </label>
              <div className="relative">
                <select
                  name="dishId"
                  value={formData.dishId}
                  onChange={handleDishSelect}
                  required
                  disabled={isLoadingDishes}
                  className="w-full appearance-none px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:opacity-50"
                >
                  <option value="">
                    {isLoadingDishes
                      ? "Chargement du catalogue..."
                      : "-- Choisir une référence --"}
                  </option>
                  {dishes.map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  {isLoadingDishes ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "▼"
                  )}
                </div>
              </div>
            </div>

            {/* Prix et Devise */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  Prix de vente
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Devise
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="Fcfa">FCFA</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Description affichée au client
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                required
                placeholder="Ex: Servie avec accompagnement au choix..."
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
              />
            </div>

            {/* Image Zone */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Photo d'illustration (optionnel)
              </label>

              {!imagePreview ? (
                <label className="group flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-orange-50/30 hover:border-orange-300 transition-all duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-orange-500 transition-colors mb-2" />
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">
                      Cliquez pour ajouter une photo
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                      PNG, JPG ou WEBP (Max. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2.5 bg-white/90 text-red-600 rounded-full hover:bg-white transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Switch Disponibilité */}
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                Rendre immédiatement disponible à la commande
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {/* Alerte Statut */}
            {submitStatus && (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  submitStatus.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                    : "bg-rose-50 text-rose-800 border border-rose-100"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <Check className="w-5 h-5 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                )}
                <span>{submitStatus.message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoadingDishes}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Publier le plat"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDishForm;
