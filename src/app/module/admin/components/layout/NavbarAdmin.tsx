"use client";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import React from "react";
import { Users, Store, UtensilsCrossed, LayoutDashboard } from "lucide-react";

export default function NavBarAdmin() {
  const { user } = useAuth();
  const [activeLink, setActiveLink] = React.useState("/admin/dashboard");

  const navItems = [
    {
      href: "/module/admin",
      icon: LayoutDashboard,
      label: "Tableau de bord",
      mobileLabel: "Accueil",
    },
    {
      href: "/module/admin/register",
      icon: Users,
      label: "Administrateurs",
      mobileLabel: "Admins",
    },

    {
      href: "/module/admin/dish",
      icon: UtensilsCrossed,
      label: "Plats",
      mobileLabel: "Plats",
    },
  ];

  return (
    <>
      {/* Navigation Desktop - Sidebar gauche */}
      <aside className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-screen md:w-64 bg-white border-r border-gray-200 shadow-sm">
        {/* Header avec info utilisateur */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/page">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || "Administrateur"}
                </h2>
                <span className="text-xs text-gray-500 capitalize">
                  {user?.role || "Admin"}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeLink === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveLink(item.href)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-orange-600" : "text-gray-400"
                  }`}
                />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">Admin Panel v1.0</p>
        </div>
      </aside>

      {/* Navigation Mobile - Bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeLink === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveLink(item.href)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
                  isActive ? "text-orange-600" : "text-gray-400"
                }`}
              >
                <Icon
                  className={`w-6 h-6 mb-1 ${
                    isActive ? "text-orange-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-orange-600" : "text-gray-600"
                  }`}
                >
                  {item.mobileLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer pour le contenu principal sur mobile */}
      <div className="md:hidden h-16" />
    </>
  );
}
