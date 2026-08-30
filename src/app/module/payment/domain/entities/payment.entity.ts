export type PaymentMethod = "orange" | "wave" | "mtn" | "moov" | "djamo";

export interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { value: "wave", label: "Wave" },
  { value: "orange", label: "Orange Money" },
  { value: "mtn", label: "MTN Mobile Money" },
  { value: "moov", label: "Moov Money" },
  { value: "djamo", label: "Djamo" },
];

export interface PaymentInitiation {
  redirectUrl: string;
}
