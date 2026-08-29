"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginDto } from "../../application/dtos/LoginDto";

// Simuler les types et hooks (à remplacer par vos imports réels)

// Hook simulé - remplacez par votre vrai hook

export default function LoginUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginDto>({
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    general: "",
  });

  const router = useRouter();
  const { login } = useAuth();
  const validateForm = (): boolean => {
    const newErrors = { phone: "", password: "", general: "" };
    let isValid = true;

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
      isValid = false;
    } else if (formData.phone.length < 8) {
      newErrors.phone = "Numéro de téléphone invalide";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };
  // const router=useRouter()
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setErrors({ phone: "", password: "", general: "" });
    try {
      const loggedUser = await login(formData.phone, formData.password);
      switch (loggedUser.role) {
        case "RESTAURATEUR":
          toast.success("Vous êtes connectez avec succès!");
          router.push("/module/restaurateur/views/dashboard");
          break;
        case "ADMIN":
          toast.success(
            "Vous êtes connectez avec succès! en tant qu'administrateur"
          );
          router.push("/module/admin");
          break;
        default:
          router.push("/page");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setErrors((prev) => ({
        ...prev,
        general: "Identifiants incorrects. Veuillez réessayer.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4 sm:p-6">
      {/* Décor */}
      <div className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 sm:w-96 sm:h-96 bg-orange-200/40 dark:bg-orange-900/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-orange-100/50 dark:bg-orange-900/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link
          href="/page"
          className="group inline-flex items-center gap-2 mb-6 text-sm font-semibold text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm group-hover:border-orange-300 group-hover:-translate-x-0.5 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </span>
          Retour à l&apos;accueil
        </Link>

        {/* Card */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-black/40 p-6 sm:p-8 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

          <div className="mb-6 sm:mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-200 dark:shadow-orange-950/40 mb-4">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Connexion sécurisée
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
              Accédez à votre espace personnel
            </p>
          </div>

          {/* Error général */}
          {errors.general && (
            <div className="mb-5 flex items-start gap-2.5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.general}
              </p>
            </div>
          )}

          <div className="space-y-5">
            {/* Phone Input */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1"
              >
                Numéro de téléphone
              </label>
              <div
                className={`group relative flex items-center rounded-2xl border-2 transition-all duration-200 ${
                  errors.phone
                    ? "border-red-300 dark:border-red-700 bg-red-50/40 dark:bg-red-900/10"
                    : "border-gray-200 dark:border-gray-600 focus-within:border-orange-500 bg-gray-50 dark:bg-gray-700/60 focus-within:bg-white dark:focus-within:bg-gray-700"
                }`}
              >
                <Phone
                  className={`absolute left-4 w-5 h-5 transition-colors pointer-events-none ${
                    errors.phone
                      ? "text-red-400"
                      : "text-gray-400 group-focus-within:text-orange-500"
                  }`}
                />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="+2250700000000"
                  disabled={isLoading}
                />
              </div>
              {errors.phone && (
                <p className="mt-2 ml-1 text-sm text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1"
              >
                Mot de passe
              </label>
              <div
                className={`group relative flex items-center rounded-2xl border-2 transition-all duration-200 ${
                  errors.password
                    ? "border-red-300 dark:border-red-700 bg-red-50/40 dark:bg-red-900/10"
                    : "border-gray-200 dark:border-gray-600 focus-within:border-orange-500 bg-gray-50 dark:bg-gray-700/60 focus-within:bg-white dark:focus-within:bg-gray-700"
                }`}
              >
                <Lock
                  className={`absolute left-4 w-5 h-5 transition-colors pointer-events-none ${
                    errors.password
                      ? "text-red-400"
                      : "text-gray-400 group-focus-within:text-orange-500"
                  }`}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-transparent pl-12 pr-12 py-3.5 rounded-2xl outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Votre mot de passe"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors disabled:cursor-not-allowed"
                  disabled={isLoading}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 ml-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-200 dark:shadow-orange-950/40 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Vous n&apos;avez pas de compte ?
            </p>
            <Link
              href="/module/auth/views/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-50 dark:bg-gray-700 text-orange-600 dark:text-orange-400 font-semibold hover:bg-orange-100 dark:hover:bg-gray-600 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Créer un compte</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          © 2024 Findi Connect. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
