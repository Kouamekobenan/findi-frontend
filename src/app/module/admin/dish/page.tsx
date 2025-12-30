import React from "react";
import NavBarAdmin from "../components/layout/NavbarAdmin";
import Dish from "../components/Dish";

export default function DishPage() {
  return (
    <>
      {/* NavBar (sidebar desktop + header/bottom mobile) */}
      <NavBarAdmin />
      {/* Contenu principal avec marges pour la navbar */}
      <main className="md:ml-64 pb-20 md:pb-0 min-h-screen bg-gray-50">
        <div className="p-4 md:p-8">
          <Dish />
        </div>
      </main>
    </>
  );
}
