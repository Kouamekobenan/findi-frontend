"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  X,
  User,
  LogOut,
  ChevronDown,
  UtensilsCrossed,
  Home,
  UserCircle,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { LogoFindi, NameApp } from "@/app/lib/constant/constant";

const MOBILE_NAV_ITEMS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/module/restaurants/views", label: "Restaurant", icon: UtensilsCrossed },
  { href: "/module/contact", label: "Message", icon: MessageCircle },
] as const;

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      {/* NavBar Desktop */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <Image
                src={LogoFindi}
                width={40}
                height={40}
                alt={NameApp}
                className="drop-shadow-sm"
                priority
              />
              <span className="text-xl font-black tracking-tight text-gray-900">
                {NameApp}
              </span>
            </Link>

            {/* Menu Desktop */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className={`relative text-sm font-semibold transition-colors py-2 ${
                  isActive("/")
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                Accueil
                {isActive("/") && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 rounded-full bg-orange-600" />
                )}
              </Link>

              <Link
                href="/module/restaurants/views"
                className={`relative flex items-center gap-2 text-sm font-semibold transition-colors py-2 ${
                  isActive("/module/restaurants/views")
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                <UtensilsCrossed size={16} />
                Devenir restaurateur
                {isActive("/module/restaurants/views") && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 rounded-full bg-orange-600" />
                )}
              </Link>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-4 border-l border-gray-200 group cursor-pointer"
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
                      <Link
                        href="/module/auth/views/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                      >
                        <User size={16} /> Mon profil
                      </Link>

                      {user.role === "ADMIN" && (
                        <Link
                          href="/module/admin"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                        >
                          <ShieldCheck size={16} /> Tableau de bord
                        </Link>
                      )}

                      <button
                        onClick={() => logout?.()}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50 cursor-pointer"
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
      <div className="md:hidden bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="flex justify-center items-center h-14">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={LogoFindi}
              width={34}
              height={34}
              alt={NameApp}
              priority
            />
            <span className="text-lg font-black tracking-tight text-gray-900">
              {NameApp}
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16 px-2">
          {MOBILE_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center flex-1 py-2 active:scale-95 transition-transform"
              >
                <span
                  className={`flex items-center justify-center w-11 h-8 rounded-full transition-colors ${
                    active ? "bg-orange-100" : ""
                  }`}
                >
                  <Icon
                    size={24}
                    strokeWidth={active ? 2.75 : 2}
                    className={active ? "text-orange-600" : "text-gray-500"}
                  />
                </span>
                <span
                  className={`text-[11px] mt-0.5 ${
                    active ? "font-bold text-orange-600" : "font-medium text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Profil / Menu */}
          {user ? (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col items-center justify-center flex-1 py-2 active:scale-95 transition-transform cursor-pointer"
            >
              <span
                className={`flex items-center justify-center w-11 h-8 rounded-full transition-colors ${
                  isMenuOpen ? "bg-orange-100" : ""
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    isMenuOpen ? "bg-orange-600" : "bg-gray-400"
                  }`}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </span>
              <span
                className={`text-[11px] mt-0.5 ${
                  isMenuOpen ? "font-bold text-orange-600" : "font-medium text-gray-500"
                }`}
              >
                Profil
              </span>
            </button>
          ) : (
            <Link
              href="/module/auth/views/login"
              className="flex flex-col items-center justify-center flex-1 py-2 active:scale-95 transition-transform"
            >
              <span
                className={`flex items-center justify-center w-11 h-8 rounded-full transition-colors ${
                  isActive("/module/auth/views/login") ? "bg-orange-100" : ""
                }`}
              >
                <UserCircle
                  size={24}
                  strokeWidth={isActive("/module/auth/views/login") ? 2.75 : 2}
                  className={
                    isActive("/module/auth/views/login")
                      ? "text-orange-600"
                      : "text-gray-500"
                  }
                />
              </span>
              <span
                className={`text-[11px] mt-0.5 ${
                  isActive("/module/auth/views/login")
                    ? "font-bold text-orange-600"
                    : "font-medium text-gray-500"
                }`}
              >
                Connexion
              </span>
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
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
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
                <Link
                  href="/module/auth/views/profile"
                  className="flex items-center gap-3 p-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span className="font-semibold">Mon profil</span>
                </Link>

                {user.role === "ADMIN" && (
                  <Link
                    href="/module/admin"
                    className="flex items-center gap-3 p-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShieldCheck size={20} />
                    <span className="font-semibold">Tableau de bord</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout?.();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut size={20} />
                  <span className="font-semibold">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer pour le contenu - évite que le bottom nav cache le contenu */}
      <div className="md:hidden h-20" />
    </>
  );
}
