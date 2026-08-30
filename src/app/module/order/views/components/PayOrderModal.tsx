"use client";

import React, { useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { Order } from "@/app/module/order/domain/entities/order.entity";
import { PaymentRepository } from "@/app/module/payment/infrastructure/payment-repository";
import { InitiatePaymentUseCase } from "@/app/module/payment/application/usecases/initiate-payment.usecase";
import {
  PAYMENT_METHODS,
  PaymentMethod,
} from "@/app/module/payment/domain/entities/payment.entity";
import { PENDING_ORDER_STORAGE_KEY } from "@/app/module/order/views/constants";
import PaymentMethodIcon from "@/app/module/payment/views/components/PaymentMethodIcon";

const paymentRepository = new PaymentRepository();
const initiatePaymentUseCase = new InitiatePaymentUseCase(paymentRepository);

interface PayOrderModalProps {
  order: Order;
  onClose: () => void;
}

export default function PayOrderModal({ order, onClose }: PayOrderModalProps) {
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!method) {
      setError("Choisissez un moyen de paiement pour continuer");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { redirectUrl } = await initiatePaymentUseCase.execute(order.id, {
        paymentMethod: method,
      });
      localStorage.setItem(PENDING_ORDER_STORAGE_KEY, order.id);
      window.location.href = redirectUrl;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Une erreur est survenue lors de l'initialisation du paiement"
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Payer ma commande</h3>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-6">
          <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4">
            <div>
              <p className="text-xs text-gray-400 font-mono">{order.reference}</p>
              <p className="font-bold text-gray-900">
                {order.restaurantName || "Restaurant"}
              </p>
            </div>
            <span className="font-bold text-green-600 text-lg">
              {order.totalAmountCents / 100} {order.currency}
            </span>
          </div>

          <div className="space-y-3">
            <span className="font-medium text-gray-700 text-sm">
              Moyen de paiement
            </span>
            <div className="grid grid-cols-1 gap-2">
              {PAYMENT_METHODS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                    method === option.value
                      ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={method === option.value}
                    onChange={() => setMethod(option.value)}
                    disabled={submitting}
                    className="accent-orange-500"
                  />
                  <PaymentMethodIcon method={option.value} size={36} />
                  <span className="text-sm font-medium text-gray-800">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100">
          <button
            onClick={handlePay}
            disabled={submitting}
            className="w-full flex cursor-pointer items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-full transition-all active:scale-95"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Redirection en cours..." : "Payer maintenant"}
          </button>
        </div>
      </div>
    </div>
  );
}
