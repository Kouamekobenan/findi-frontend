import React from "react";
import RestaurantDashboard from "../../components/layout/NavBarRestaurateur";
import ParametrageRestaurant from "../../components/parametre/Parametre";
export default function SettingPage() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR : Fixe à gauche sur desktop, cachée ou transformée sur mobile */}
      <RestaurantDashboard />
      <div className="flex flex-col flex-1 pt-20 md:pt-1 w-0 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <ParametrageRestaurant />
          </div>
        </main>
      </div>
    </div>
  );
}
