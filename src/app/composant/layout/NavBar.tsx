"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  UtensilsCrossed,
  Home,
  Search,
  Heart,
  UserCircle,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { LogoFindi, NameApp } from "@/app/lib/constant/constant";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      {/* NavBar Desktop - reste en haut */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-2xl font-black tracking-tighter text-orange-600"
              >
                {/* FINDI<span className="text-gray-900">.</span> */}
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
            </div>

            {/* Menu Desktop */}
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors"
              >
                Accueil
              </Link>

              <Link
                href="/module/restaurants/views"
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors"
              >
                <UtensilsCrossed size={16} />
                Devenir restaurateur
              </Link>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-4 border-l border-gray-200 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold border border-orange-200 group-hover:bg-orange-600 group-hover:text-white transition-all">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs text-gray-400 leading-none">
                        Bonjour,
                      </p>
                      <p className="text-sm font-bold text-gray-700">
                        {user.name}
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs font-medium text-gray-400 uppercase">
                          Mon Compte
                        </p>
                      </div>
                      {user.role === "ADMIN" && (
                        <Link
                          href="/module/admin"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                        >
                          <User size={16} /> Mon profil
                        </Link>
                      )}

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
                  href="/module/auth/views/login"
                  className="bg-orange-600 text-white px-5 py-2.5 rounded-full hover:bg-orange-700 transition-all shadow-md shadow-orange-200 font-bold text-sm active:scale-95"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Top Bar Mobile - simple logo */}
      <div className="md:hidden bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="flex justify-center items-center h-14">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-orange-600"
          >
            {/* FINDI<span className="text-gray-900">.</span> */}
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
        </div>
      </div>
      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-2xl">
        <div className="flex justify-around items-center h-16 px-2">
          {/* Accueil */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-600 active:scale-95 transition-all"
          >
            <Home size={24} strokeWidth={2} />
            <span className="text-xs font-medium mt-1">Accueil</span>
          </Link>

          {/* Recherche */}
          <Link
            href="/page"
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-600 active:scale-95 transition-all"
          >
            <Search size={24} strokeWidth={2} />
            <span className="text-xs font-medium mt-1">search</span>
          </Link>
          {/* Devenir Restaurateur */}
          <Link
            href="/module/restaurants/views"
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-600 active:scale-95 transition-all"
          >
            <UtensilsCrossed size={24} strokeWidth={2} />
            <span className="text-xs font-medium mt-1">Restaurant</span>
          </Link>

          {/* Favoris */}
          <Link
            href="/module/contact"
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-600 active:scale-95 transition-all"
          >
            <MessageCircle size={24} strokeWidth={2} />

            <span className="text-xs font-medium mt-1">message</span>
          </Link>

          {/* Profil / Menu */}
          {user ? (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-600 active:scale-95 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium mt-1">Profil</span>
            </button>
          ) : (
            <Link
              href="/module/auth/views/login"
              className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-600 active:scale-95 transition-all"
            >
              <UserCircle size={24} strokeWidth={2} />
              <span className="text-xs font-medium mt-1">Connexion</span>
            </Link>
          )}
        </div>
      </nav>
      {/* Menu Modal Mobile (profil utilisateur) */}
      {isMenuOpen && user && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Menu Slide Up */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 animate-in slide-in-from-bottom duration-300 pb-20">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Mon Compte</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl">
                <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xl">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                {user.role === "ADMIN" && (
                  <Link
                    href="/module/admin"
                    className="flex items-center gap-3 p-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} />
                    <span className="font-semibold">Mon profil</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout?.();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-semibold">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer pour le contenu (évite que le bottom nav cache le contenu) */}
      <div className="md:hidden h-16" />
    </>
  );
}
