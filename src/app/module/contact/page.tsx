"use client";
import { NavBar } from "@/app/composant/layout/NavBar";
import { useAuth } from "@/app/context/AuthContext";
import {
  Lock,
  Send,
  MessageSquare,
  AlertTriangle,
  UtensilsCrossed,
  Mail,
  User,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import React, { useState, ChangeEvent } from "react";

interface FormData {
  name: string;
  email: string;
  subject: "appreciation" | "report" | "suggestion";
  message: string;
  restaurantName: string;
  dishName: string;
  dishDescription: string;
}

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "appreciation",
    message: "",
    restaurantName: "",
    dishName: "",
    dishDescription: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "appreciation",
          message: "",
          restaurantName: "",
          dishName: "",
          dishDescription: "",
        });

        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const subjectOptions = [
    {
      value: "appreciation",
      label: "Appréciation de l'App",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      value: "report",
      label: "Signaler un Restaurant",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      value: "suggestion",
      label: "Proposer un Plat",
      icon: UtensilsCrossed,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Message envoyé !
          </h2>
          <p className="text-gray-600 mb-6">
            Merci pour votre retour. Notre équipe reviendra vers vous dans les
            plus brefs délais.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 px-5">
      <NavBar />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Envoyez une appréciation de l&apos;App, signalez un restaurant ou
            proposez un plat. Votre retour est précieux pour nous !
          </p>
        </div>
        {/* Subject Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {subjectOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.subject === option.value;
            return (
              <button
                key={option.value}
                type="button"
                // onClick={() =>
                // //   setFormData((prev) => ({ ...prev, subject: option.value }))
                // }
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 shadow-lg scale-105"
                    : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center mb-3`}
                >
                  <Icon className={`${option.color} w-6 h-6`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {option.label}
                </h3>
              </button>
            );
          })}
        </div>
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Champs conditionnels selon le sujet */}
            {formData.subject === "report" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom du restaurant à signaler *
                </label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Restaurant Le Gourmet"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
              </div>
            )}

            {formData.subject === "suggestion" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom du plat *
                  </label>
                  <input
                    type="text"
                    name="dishName"
                    value={formData.dishName}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Attiéké Poisson"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Restaurant concerné (optionnel)
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    placeholder="Nom du restaurant"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Votre message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder={
                  formData.subject === "appreciation"
                    ? "Parlez-nous de votre expérience avec l'application..."
                    : formData.subject === "report"
                    ? "Décrivez le problème rencontré avec ce restaurant..."
                    : "Décrivez le plat que vous aimeriez voir sur la plateforme..."
                }
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-2">
                Minimum 20 caractères
              </p>
            </div>

            {/* Note d'information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Mail className="text-blue-600 flex-shrink-0 mt-0.5 w-5 h-5" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">
                    Traitement de votre demande
                  </h4>
                  <p className="text-blue-800 text-xs">
                    Votre message sera envoyé directement à notre équipe
                    administrative. Nous vous répondrons dans un délai de 48
                    heures maximum.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || formData.message.length < 20}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>
        {/* Footer info */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            Vous pouvez aussi nous contacter directement à{" "}
            <a
              href="mailto:contact@votreapp.com"
              className="text-orange-600 hover:underline font-semibold"
            >
              contact@votreapp.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
