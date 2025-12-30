import React from "react";
import NavBarAdmin from "./components/layout/NavbarAdmin";
import RestaurantAdmin from "./components/Restaurant";
export default function AdminPage() {
  return (
    <>
         {/* NavBar (sidebar desktop + header/bottom mobile) */}
         <NavBarAdmin />
         {/* Contenu principal avec marges pour la navbar */}
         <main className="flex-1 md:ml-64 pb-1 md:pb-0 min-h-screen bg-gray-50">
           <div className=" md:p-8">
             <RestaurantAdmin />
           </div>
         </main>
       </>
  );
}
