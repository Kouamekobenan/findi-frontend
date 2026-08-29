"use client";

import { Suspense } from "react";
import PaymentResultView from "@/app/module/payment/views/components/PaymentResultView";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentResultView redirectStatus="success" />
    </Suspense>
  );
}
