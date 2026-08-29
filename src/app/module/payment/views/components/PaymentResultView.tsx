"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Order } from "@/app/module/order/domain/entities/order.entity";
import { PaymentRepository } from "@/app/module/payment/infrastructure/payment-repository";
import { GetPaymentStatusUseCase } from "@/app/module/payment/application/usecases/get-payment-status.usecase";
import { PENDING_ORDER_STORAGE_KEY } from "@/app/module/order/views/constants";

const paymentRepository = new PaymentRepository();
const getPaymentStatusUseCase = new GetPaymentStatusUseCase(paymentRepository);

const MAX_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 2000;

type ViewState = "checking" | "paid" | "failed" | "pending" | "not-found";

function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="text-left bg-gray-50 rounded-xl p-4 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Référence</span>
        <span className="font-semibold text-gray-900">{order.reference}</span>
      </div>
      <div className="space-y-1.5 border-t border-gray-200 pt-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-700">
              {item.quantity} × plat ({item.unitPriceCents / 100} {item.currency})
            </span>
            <span className="text-gray-900 font-medium">
              {(item.quantity * item.unitPriceCents) / 100} {item.currency}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between border-t border-gray-200 pt-3">
        <span className="font-bold text-gray-900">Total</span>
        <span className="font-bold text-green-600 text-lg">
          {order.totalAmountCents / 100} {order.currency}
        </span>
      </div>
    </div>
  );
}

export default function PaymentResultView({
  redirectStatus,
}: {
  redirectStatus: "success" | "error";
}) {
  const [state, setState] = useState<ViewState>("checking");
  const [order, setOrder] = useState<Order | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId =
      searchParams.get("orderId") ||
      localStorage.getItem(PENDING_ORDER_STORAGE_KEY);
    if (!orderId) {
      setState("not-found");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      try {
        const result = await getPaymentStatusUseCase.execute(orderId);
        if (cancelled) return;
        setOrder(result);

        if (result.status === "PAID") {
          localStorage.removeItem(PENDING_ORDER_STORAGE_KEY);
          setState("paid");
          return;
        }
        if (result.status === "PAYMENT_FAILED" || result.status === "CANCELLED") {
          localStorage.removeItem(PENDING_ORDER_STORAGE_KEY);
          setState("failed");
          return;
        }

        attempts += 1;
        if (attempts >= MAX_ATTEMPTS) {
          setState("pending");
          return;
        }
        setTimeout(poll, POLL_INTERVAL_MS);
      } catch (error) {
        if (!cancelled) setState("not-found");
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-5">
        {state === "checking" && (
          <>
            <Loader2 className="w-14 h-14 text-orange-500 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">
              Vérification du paiement...
            </h2>
            <p className="text-gray-600 text-sm">
              Merci de patienter pendant que nous confirmons votre paiement.
            </p>
          </>
        )}

        {state === "paid" && order && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Paiement réussi</h2>
            <p className="text-gray-600 text-sm">
              Votre commande a bien été payée.
            </p>
            <OrderSummary order={order} />
            <Link
              href="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition-all"
            >
              Retour à l'accueil
            </Link>
          </>
        )}

        {state === "failed" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Paiement échoué</h2>
            <p className="text-gray-600 text-sm">
              Le paiement de votre commande {order?.reference} n'a pas abouti.
              Vous pouvez réessayer depuis la page du restaurant.
            </p>
            <Link
              href="/"
              className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-full transition-all"
            >
              Retour à l'accueil
            </Link>
          </>
        )}
        {state === "pending" && (
          <>
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">
              Paiement en cours de traitement
            </h2>
            <p className="text-gray-600 text-sm">
              Nous n'avons pas encore reçu la confirmation. Cela peut prendre
              quelques instants supplémentaires ; vous recevrez une
              confirmation dès que le paiement sera validé.
            </p>
            <Link
              href="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition-all"
            >
              Retour à l'accueil
            </Link>
          </>
        )}

        {state === "not-found" && (
          <>
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">
              Aucune commande à vérifier
            </h2>
            <p className="text-gray-600 text-sm">
              {redirectStatus === "success"
                ? "Si un paiement a bien été effectué, consultez vos commandes."
                : "Le paiement a été annulé ou a échoué."}
            </p>
            <Link
              href="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition-all"
            >
              Retour à l'accueil
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
