export type PaymentMethod = "orange" | "wave" | "mtn" | "moov" | "djamo";

export interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  logo: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { value: "wave", label: "Wave", logo: "/payments/wave.png" },
  { value: "orange", label: "Orange Money", logo: "/payments/orange.png" },
  { value: "mtn", label: "MTN Mobile Money", logo: "/payments/mtn.png" },
  { value: "moov", label: "Moov Money", logo: "/payments/moov.png" },
  { value: "djamo", label: "Djamo", logo: "/payments/djamo.png" },
];

export interface PaymentInitiation {
  redirectUrl: string;
}
