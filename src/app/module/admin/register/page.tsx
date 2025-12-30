"use client";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import { useState } from "react";
import { RegisterDto } from "../../auth/application/dtos/Registere.dto";
import { UseRole } from "../../auth/domain/enums/enum.user.role";
import { UserRepository } from "../../auth/infrastructure/user.repository";
import { RegisterUseCase } from "../../auth/application/usecases/create-user.usecase";
import NavBarAdmin from "../components/layout/NavbarAdmin";

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterDto>({
    email: "",
    password: "",
    name: "",
    role: UseRole.ADMIN,
  });
  // J'ai mis le LOGO_SRC ici pour la clarté, mais il peut rester en dehors.

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterDto, string>>
  >({});

  // Instanciation du Repository et UseCase (Gardé pour la fonctionnalité)
  const userRepo = new UserRepository();
  const createUserUseCase = new RegisterUseCase(userRepo);

  // Récupération des villes

  // Validation en temps réel (inchangée)
  const validateField = (name: keyof RegisterDto, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (value.trim().length < 3) {
          error = "Le nom doit contenir au moins 3 caractères";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = "Email invalide";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "Le mot de passe doit contenir au moins 6 caractères";
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  // Gestion des changements de champs (inchangée)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (message) {
      setMessage("");
      setMessageType("");
    }
    validateField(name as keyof RegisterDto, value);
  };

  // Soumission du formulaire (inchangée)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    const isEmailValid = validateField("email", formData.email);
    const isPasswordValid = validateField("password", formData.password);
    const isNameValid = validateField("name", formData.name);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      setLoading(false);
      return;
    }

    try {
      const dto: RegisterDto = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,

        role: formData.role,
        // refreshToken: formData.refreshToken,
      };
      const response = await createUserUseCase.execute(dto);

      // ✅ Utiliser formData au lieu de user
      toast.success(
        `Bienvenue ${formData.name} ! Votre compte  admin est créé.`
      );
      setMessageType("success");

      setTimeout(() => {
        setMessage(
          `Bienvenue ${formData.name} ! Votre compte a été créé avec succès.`
        );
        setFormData({
          name: "",
          email: "",
          password: "",
          role: UseRole.ADMIN,
        });
      }, 500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'inscription";
      toast.error(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
  // Classes de style (inchangées)
  const inputClass = (name: keyof RegisterDto) => `
    w-full pl-11 pr-4 text-gray-800 py-3 border rounded-xl 
    focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
    transition-all duration-300 ease-in-out
    ${
      errors[name]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-gray-300 hover:border-teal-400"
    }
  `;

  return (
    <div className="">
      <NavBarAdmin />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-100 to-purple-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Modification : Rendre le max-w plus petit sur mobile (sm:max-w-md -> max-w-xs ou sm:max-w-sm) */}
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Conteneur principal (suppression du hover:scale pour le tactile) */}
          <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 transition-all duration-300 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-4">
              {/* LOGO AMÉLIORÉ et OPTIMISÉ pour le responsive */}

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-700">
                Inscription
              </h1>
              <p className="text-sm sm:text-base text-gray-500">
                Créez un compte Administrateur en quelques secondes
              </p>
            </div>
            {/* Formulaire : Réduction de l'espace vertical (space-y-3 au lieu de space-y-6) */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Nom complet */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <User className="absolute left-3 top-[37px] w-5 h-5 text-gray-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass("name")}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>
              {/* Email */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <Mail className="absolute left-3 top-[37px] w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass("email")}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>
              {/* Téléphone */}

              {/* Mot de passe */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <Lock className="absolute left-3 top-[37px] w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass("password") + " pr-12"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[37px] p-1 text-gray-500 hover:text-teal-600 transition-colors"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>
              {/* Ville */}

              {/* Bouton de soumission (Simplification du dégradé pour la clarté) */}
              <button
                type="submit"
                // Suppression du dégradé complexe, utilisation du teal-600 avec hover
                className="w-full bg-orange-600 cursor-pointer text-white py-3 rounded-xl font-semibold text-base sm:text-lg
                hover:bg-orange-700 focus:ring-4 focus:ring-orange-200 transition-all duration-300 
                shadow-lg shadow-teal-300/50 hover:shadow-xl hover:shadow-teal-400/60
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </form>
            {/* Message de retour */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-xl flex items-start gap-3 transition-all duration-500 animate-in fade-in slide-in-from-top-1 ${
                  messageType === "success"
                    ? "bg-green-50 text-green-800 border-l-4 border-green-400"
                    : "bg-red-50 text-red-800 border-l-4 border-red-400"
                }`}
              >
                {messageType === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                )}
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
            {/* Lien de connexion */}
          </div>
          {/* Footer - Mentions Légales */}
          <p className="text-center text-xs text-gray-500 mt-4 max-w-sm mx-auto">
            En créant un compte, vous acceptez nos
            <a
              href="#"
              className="text-orange-600 hover:underline transition-colors"
            >
              Conditions d'utilisation
            </a>
            et notre
            <a
              href="#"
              className="text-orange-600 hover:underline transition-colors"
            >
              Politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
