export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PAYMENT_FAILED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  restaurantDishId: string;
  quantity: number;
  unitPriceCents: number;
  currency: string;
  dishName: string | null;
  dishImage: string | null;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  totalAmountCents: number;
  currency: string;
  reference: string;
  paymentMethod: string | null;
  jekoPaymentRequestId: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  restaurantName: string | null;
  restaurantImage: string | null;
}
