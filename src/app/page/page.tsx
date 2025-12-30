import React from "react";
import { DishExplorer } from "../module/restaurantDish/views/components/FindDishByCity";
import { NavBar } from "../composant/layout/NavBar";
export default function Page() {
  return (
    <div>
      <div className="">
        {/* <RestaurantList /> */}
        <NavBar />
        <DishExplorer />
      </div>
    </div>
  );
}
