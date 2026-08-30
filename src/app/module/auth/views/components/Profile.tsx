"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { OrderRepository } from "@/app/module/order/infrastructure/order-repository";
import { ListMyOrdersUseCase } from "@/app/module/order/application/usecases/list-my-orders.usecase";
import { Order, OrderStatus } from "@/app/module/order/domain/entities/order.entity";
import { safeImageUrl } from "@/app/module/common/safe-image-url";

const orderRepository = new OrderRepository();
const listMyOrdersUseCase = new ListMyOrdersUseCase(orderRepository);

const LIMIT = 5;

const STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> = {
  PENDING_PAYMENT: {
    label: "En attente de paiement",
    className: "bg-orange-50 text-orange-600 border-orange-200",
  },
  PAID: {
    label: "Payée",
    className: "bg-green-50 text-green-600 border-green-200",
  },
  PAYMENT_FAILED: {
    label: "Paiement échoué",
    className: "bg-red-50 text-red-600 border-red-200",
  },
  CANCELLED: {
    label: "Annulée",
    className: "bg-gray-100 text-gray-500 border-gray-200",
  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`text-xs font-bold px-3 py-1 rounded-full border ${style.className}`}
    >
      {style.label}
    </span>
  );
}

function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={safeImageUrl(order.restaurantImage, "/placeholder.jpg")}
              alt={order.restaurantName || "Restaurant"}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate">
              {order.restaurantName || "Restaurant"}
            </p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-1.5 border-t border-gray-100 pt-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.quantity} × {item.dishName || "Plat"}
            </span>
            <span className="text-gray-800 font-medium">
              {(item.quantity * item.unitPriceCents) / 100} {item.currency}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-400 font-mono">{order.reference}</span>
        <span className="font-bold text-gray-900">
          {order.totalAmountCents / 100} {order.currency}
        </span>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    if (!user) {
      router.push("/module/auth/views/login?redirect=/module/auth/views/profile");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const result = await listMyOrdersUseCase.execute(page, LIMIT);
        setOrders(result.data || []);
        setTotalPage(result.totalPage || 1);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, user]);

  if (!user) {
    return null;
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
        {/* Carte profil */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-black text-3xl border-2 border-orange-200 flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1 w-fit mx-auto sm:mx-0">
                  <ShieldCheck size={12} />
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-gray-400">Membre depuis {memberSince}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 pt-2">
                {user.email && (
                  <span className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600">
                    <Mail size={15} className="text-gray-400" />
                    {user.email}
                  </span>
                )}
                {user.phone && (
                  <span className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600">
                    <Phone size={15} className="text-gray-400" />
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Historique des commandes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">Mes commandes</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                Vous n'avez pas encore passé de commande.
              </p>
              <Link
                href="/"
                className="inline-block mt-4 text-orange-600 font-bold hover:underline text-sm"
              >
                Découvrir des restaurants
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>

              {totalPage > 1 && (
                <div className="flex justify-center items-center gap-3 pt-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    Page {page} / {totalPage}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                    disabled={page === totalPage}
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
