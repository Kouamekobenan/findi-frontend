"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Share2,
  Check,
  LayoutDashboard,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { LogoFindi, NameApp } from "@/app/lib/constant/constant";

interface PropsId {
  restaurId?: string;
}

export default function NavBar({ restaurId }: PropsId) {
  const [isOpen, setIsOpen] = useState(false); // Menu mobile
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Dropdown profil
  const [copied, setCopied] = useState(false);

  const { user, logout } = useAuth(); // On récupère logout du contexte
  const dropdownRef = useRef<HTMLDivElement>(null);

  const restaurantId = user?.restaurants?.[0]?.id;
  const isOwner = restaurantId === restaurId;

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Findi", url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 w-full z-50 sticky top-0 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-orange-600"
          >
            <div className="mb-8 mt-14 animate-fade-in-up">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-orange-400 rounded-full filter blur-2xl opacity-30 animate-pulse"></div>
                <Image
                  src={LogoFindi}
                  width={50}
                  height={50}
                  alt={NameApp}
                  className="relative z-10 drop-shadow-lg"
                  priority
                />
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/page"
              className="text-sm font-medium hover:text-orange-600 transition-colors"
            >
              Accueil
            </Link>

            <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold ${
                copied
                  ? "bg-green-50 border-green-200 text-green-600"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              {copied ? "Copié" : "Partager"}
            </button>

            {/* Restaurant Owner Profile Dropdown */}
            {isOwner ? (
              <div
                className="relative pl-4 border-l border-gray-100"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Card */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400">Restaurateur</p>
                      <p className="text-sm font-bold truncate">{user?.name}</p>
                    </div>

                    <Link
                      href={`/module/restaurateur/views/dashboard`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>

                    <Link
                      href="/module/restaurateur/views/parametre"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                    >
                      <Settings size={16} /> Paramètres
                    </Link>

                    <button
                      onClick={() => logout?.()}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50"
                    >
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-bold text-orange-600 hover:underline"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 bg-gray-50 rounded-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg">
          <Link href="/page" className="block font-medium py-2">
            Accueil
          </Link>

          {isOwner && (
            <div className="space-y-2 pt-2 border-t border-gray-50">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Mon Restaurant
              </p>
              <Link
                href={`/module/restaurateur/views/dashboard`}
                className="flex items-center gap-3 p-3 bg-orange-600 text-white rounded-xl font-bold"
              >
                <LayoutDashboard size={20} /> Dashboard
              </Link>
              <button
                onClick={() => logout?.()}
                className="flex items-center gap-3 w-full p-3 text-red-600 font-medium"
              >
                <LogOut size={20} /> Déconnexion
              </button>
            </div>
          )}

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl text-sm font-bold"
          >
            <Share2 size={18} /> Partager la page
          </button>
        </div>
      )}
    </nav>
  );
}
