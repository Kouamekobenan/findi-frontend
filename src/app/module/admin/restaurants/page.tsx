import React from "react";
import NavBarAdmin from "../components/layout/NavbarAdmin";
import RestaurantAdmin from "../components/Restaurant";
export default function RestaurantPage() {
  return (
    <>
      <NavBarAdmin />
      <main className=" flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen bg-gray-50">
        <div className="p-4 md:p-8">
          <RestaurantAdmin />
        </div>
      </main>
    </>
  );
}
