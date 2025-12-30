"use client";
import { useParams } from "next/navigation";
import NavBar from "../../components/NavBar";
import RestaurantDishList from "../../components/RestaurantDishList";

export default function RestaurantDishPage() {
  const params = useParams();
  const id = params.id as string;
  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar restaurId={id} />
      <RestaurantDishList />
    </main>
  );
}
