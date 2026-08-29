import { Order } from "@/app/module/order/domain/entities/order.entity";
import { PaymentInitiation } from "../entities/payment.entity";
import { InitiatePaymentDto } from "../../application/dtos/initiate-payment.dto";

export interface IPaymentRepository {
  initiate(orderId: string, dto: InitiatePaymentDto): Promise<PaymentInitiation>;
  getStatus(orderId: string): Promise<Order>;
}
