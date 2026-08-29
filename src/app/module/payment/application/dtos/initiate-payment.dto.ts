import { PaymentMethod } from "../../domain/entities/payment.entity";

export interface InitiatePaymentDto {
  paymentMethod: PaymentMethod;
}
