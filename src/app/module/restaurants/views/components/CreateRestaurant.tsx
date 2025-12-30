"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  PlusCircle,
  Image as ImageIcon,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Info,
  AlertCircle,
  Lock,
} from "lucide-react";
import { RestaurantRepository } from "../../infrastructure/restaurant-repository";
import { CreateRestaurantUseCase } from "../../application/usecases/create-restaurant.usecase";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { NavBar } from "@/app/composant/layout/NavBar";
import { api } from "@/app/prisma/api";

const createRestaurantSchema = z.object({
  name: z.string().min(3, "Le nom doit avoir au moins 3 caractères"),
  description: z.string().min(10, "La description est trop courte"),
  address: z.string().min(5, "L'adresse est requise"),
  country: z.string().min(2, "La ville est requise"),
  phone: z.string().min(8, "Numéro de téléphone requis"),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  openingHours: z.record(z.string(), z.string()),
});

const restauRepo = new RestaurantRepository();
const createRestaurantUseCase = new CreateRestaurantUseCase(restauRepo);
type CreateFormValues = z.infer<typeof createRestaurantSchema>;

export default function CreateRestaurant() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateFormValues>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: { openingHours: {} },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (data: CreateFormValues) => {
    setLoading(true);
    if (!userId) {
      return;
    }
    try {
      await createRestaurantUseCase.execute(
        { ...data, userId, isActive: false },
        file
      );
      // await api.patch(`/restaurant/deactivate/${}`)
      setShowSuccessMessage(true);
      toast.success("Restaurant créé avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="mb-4 flex justify-center">
            <Lock className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Accès restreint
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <Link
            href="/module/auth/views/login"
            className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-10 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600 w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Demande envoyée avec succès !
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 flex-shrink-0 mt-1 w-5 h-5 sm:w-6 sm:h-6" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                  Vérification en cours
                </h3>
                <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                  Votre restaurant est en cours de vérification par notre
                  équipe. Ce processus permet de garantir la qualité et
                  l'authenticité des établissements sur notre plateforme.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 mb-8">
            <div className="flex items-start gap-3">
              <Clock className="text-orange-600 flex-shrink-0 mt-1 w-5 h-5 sm:w-6 sm:h-6" />
              <div className="text-left">
                <h3 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">
                  Activation sous 24 heures
                </h3>
                <p className="text-orange-800 text-xs sm:text-sm leading-relaxed">
                  Votre compte sera activé dans un délai maximum de 24 heures
                  après validation par nos développeurs. Vous recevrez une
                  notification par email dès que votre restaurant sera en ligne.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full sm:w-auto bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50  px-4">
      <NavBar />
      <div className="max-w-3xl mx-auto py-2">
        {/* Message d'information initial */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 sm:mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5 w-5 h-5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">
                Processus de vérification
              </h3>
              <p className="text-blue-800 text-xs sm:text-sm">
                Après soumission, votre restaurant sera vérifié et activé sous
                24h maximum.
              </p>
            </div>
          </div>
        </div>

        {/* Stepper Header */}
        <div className="flex justify-center mb-6 sm:mb-8 px-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex items-center ${
                step >= i ? "text-orange-500" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 text-sm sm:text-base ${
                  step >= i
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                }`}
              >
                {step > i ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  i
                )}
              </div>
              {i < 3 && (
                <div
                  className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${
                    step > i ? "bg-orange-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          {/* ÉTAPE 1 : IDENTITÉ */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                Identité du Restaurant
              </h2>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Nom du Restaurant *
                </label>
                <input
                  {...register("name")}
                  placeholder="Ex: La Cloche d'Or"
                  className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Parlez-nous de votre cuisine..."
                  className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base resize-none"
                />
                {errors.description && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : CONTACT & PHOTO */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                Localisation & Image
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="w-24 h-24 bg-white rounded-lg border-2 border-dashed border-orange-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {preview ? (
                    <img
                      src={preview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <ImageIcon className="text-orange-300" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs sm:text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer file:text-xs sm:file:text-sm"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold block mb-1">
                    Adresse complète *
                  </label>
                  <input
                    {...register("address")}
                    placeholder="Ex: Cocody, Riviera Palmeraie"
                    className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"
                  />
                  {errors.address && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.address.message}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold block mb-1">
                      Ville *
                    </label>
                    <input
                      {...register("country")}
                      placeholder="Ex: Abidjan"
                      className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"
                    />
                    {errors.country && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.country.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold block mb-1">
                      Téléphone *
                    </label>
                    <input
                      {...register("phone")}
                      placeholder="+225 XX XX XX XX XX"
                      className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1">
                    Site Web (Optionnel)
                  </label>
                  <input
                    {...register("website")}
                    className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"
                    placeholder="https://..."
                  />
                  {errors.website && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.website.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : HORAIRES & VALIDATION */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                Horaires d'ouverture
              </h2>
              <div className="space-y-3">
                {[
                  "Lundi",
                  "Mardi",
                  "Mercredi",
                  "Jeudi",
                  "Vendredi",
                  "Samedi",
                  "Dimanche",
                ].map((day) => (
                  <div
                    key={day}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium">{day}</span>
                    <input
                      type="text"
                      placeholder="08:00-22:00"
                      className="w-full sm:w-32 p-2 text-sm border rounded-lg bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                      onChange={(e) => {
                        const current = watch("openingHours");
                        setValue("openingHours", {
                          ...current,
                          [day.toLowerCase()]: e.target.value,
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 sm:mt-10">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center gap-2 px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all order-2 sm:order-1"
              >
                <ChevronLeft size={20} /> Retour
              </button>
            )}
            <div
              className={`${
                step > 1 ? "order-1 sm:order-2 sm:ml-auto" : "ml-auto"
              }`}
            >
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
                >
                  Suivant <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Création..." : "Créer le restaurant"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
