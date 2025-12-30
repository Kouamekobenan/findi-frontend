"use client";
import React, { useEffect, useState } from "react";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { CreateDishDto } from "@/app/module/restaurantDish/application/dtos/createDish.dto";
import { Dish } from "@/app/module/dish/domain/entities/dish.entity";
import { DishRepository } from "@/app/module/dish/infrastructure/dish-repository";
import { FindAllDishUsecase } from "@/app/module/dish/application/usecasese/find-all-dish.usecase";
import { useAuth } from "@/app/context/AuthContext";
import { RestaurantDishRepository } from "@/app/module/restaurantDish/infrastructure/restaurantDish-repository";
import { CreateRestauDishUseCase } from "@/app/module/restaurantDish/application/usecases/create-restauDish.usecase";
import { UpdateDishUsecae } from "@/app/module/dish/application/usecasese/dish-update.usecase";

// Type pour le statut de soumission
interface SubmitStatus {
  type: "success" | "error";
  message: string;
}

const RestaurantDishForm: React.FC = () => {
  // État du formulaire avec typage correct
  const [formData, setFormData] = useState<CreateDishDto>({
    restaurantId: "",
    dishId: "",
    price: 0, // Changé de "" à 0 pour correspondre au type number
    currency: "Fcfa",
    description: "",
    isAvailable: true,
  });

  // Instances des repositories et use cases (optimisation: créer une seule fois)
  const [repositories] = useState(() => ({
    dishRepo: new DishRepository(),
    restauDishRepo: new RestaurantDishRepository(),
  }));

  const [useCases] = useState(() => ({
    findAllDish: new FindAllDishUsecase(repositories.dishRepo),
    updateDish: new UpdateDishUsecae(repositories.dishRepo),
    createRestauDish: new CreateRestauDishUseCase(repositories.restauDishRepo),
  }));

  // États avec typage correct
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoadingDishes, setIsLoadingDishes] = useState<boolean>(true);

  const { user } = useAuth();
  const restaurantId = user?.restaurants?.[0]?.id || "";

  // Récupération des plats avec gestion d'erreur améliorée
  const fetchDishData = async (): Promise<void> => {
    try {
      setIsLoadingDishes(true);
      const res = await useCases.findAllDish.execute();
      setDishes(res);
    } catch (error) {
      console.error("Erreur lors de la récupération des plats:", error);
      setSubmitStatus({
        type: "error",
        message: "Impossible de charger les plats disponibles",
      });
    } finally {
      setIsLoadingDishes(false);
    }
  };

  useEffect(() => {
    fetchDishData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gestionnaire de changement avec typage correct
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price"
          ? parseFloat(value) || 0 // Conversion en number pour le prix
          : value,
    }));
  };

  // Sélection du plat avec typage correct
  const handleDishSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedDishId = e.target.value;
    const selectedDish = dishes.find((d) => d.id === selectedDishId);

    setFormData((prev) => ({
      ...prev,
      dishId: selectedDishId,
      description: selectedDish?.description || "",
    }));
  };

  // Upload d'image avec typage correct
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

  // Suppression de l'image
  const removeImage = (): void => {
    setCustomImage(null);
    setImagePreview(null);
  };

  // Soumission du formulaire avec gestion d'erreur améliorée
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    // Validation avant soumission
    if (!formData.dishId) {
      setSubmitStatus({
        type: "error",
        message: "Veuillez sélectionner un plat",
      });
      return;
    }

    if (!formData.price || formData.price <= 0) {
      setSubmitStatus({
        type: "error",
        message: "Veuillez saisir un prix valide",
      });
      return;
    }

    if (!formData.description.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Veuillez ajouter une description",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Étape 1: Créer l'association restaurant-plat
      await useCases.createRestauDish.execute({
        ...formData,
        restaurantId,
      });

      console.log("✅ Association restaurant-plat créée");

      // Étape 2: Si une image personnalisée est fournie, mettre à jour le plat
      if (customImage) {
        const updateDishDto = {
          description: formData.description,
        };

        console.log("🖼️ Mise à jour du plat avec image:", {
          dishId: formData.dishId,
          updateDishDto,
          hasImage: true,
        });

        await useCases.updateDish.execute(
          formData.dishId,
          updateDishDto,
          customImage
        );

        console.log("✅ Image personnalisée ajoutée");
      }

      setSubmitStatus({
        type: "success",
        message: "Plat ajouté avec succès à votre restaurant!",
      });

      // Réinitialiser le formulaire après succès
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
      console.error("❌ Erreur lors de l'ajout du plat:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? `Erreur: ${error.message}`
            : "Erreur lors de l'ajout du plat",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Ajouter un Plat à votre Restaurant
          </h1>
          <p className="text-gray-600 mb-6">
            Sélectionnez un plat et personnalisez-le pour votre établissement
          </p>

          <div className="space-y-6">
            {/* Sélection du plat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un Plat
              </label>
              <select
                name="dishId"
                value={formData.dishId}
                onChange={handleDishSelect}
                required
                disabled={isLoadingDishes}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {isLoadingDishes
                    ? "Chargement des plats..."
                    : "-- Choisir un plat --"}
                </option>
                {dishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {dish.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Prix et Devise */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="19.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Devise
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Fcfa">Fcfa (FCFA)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description Personnalisée
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Décrivez votre plat..."
              />
            </div>

            {/* Upload d'image personnalisée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Personnalisée (optionnel)
              </label>

              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Cliquez pour télécharger une image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Disponibilité */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Plat disponible
              </label>
            </div>

            {/* Message de statut */}
            {submitStatus && (
              <div
                className={`flex items-center gap-2 p-4 rounded-lg ${
                  submitStatus.type === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{submitStatus.message}</span>
              </div>
            )}

            {/* Bouton de soumission */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isLoadingDishes}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Ajout en cours..."
                : isLoadingDishes
                ? "Chargement..."
                : "Ajouter le Plat"}
            </button>
          </div>
        </div>

        {/* Informations sur le processus */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            📋 Processus d'ajout
          </h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>
              Création de l'association restaurant-plat avec le prix et la
              description
            </li>
            <li>
              Si une image est fournie, mise à jour du plat avec l'image
              personnalisée
            </li>
            <li>Le plat est maintenant disponible dans votre restaurant</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDishForm;
