"use client";

import PaymentResultView from "@/app/module/payment/views/components/PaymentResultView";

export default function PaymentErrorPage() {
  return <PaymentResultView redirectStatus="error" />;
}
