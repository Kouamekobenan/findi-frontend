import { api } from "@/app/prisma/api";
import { Order } from "@/app/module/order/domain/entities/order.entity";
import { IPaymentRepository } from "../domain/interfaces/payment-repository.interface";
import { PaymentInitiation } from "../domain/entities/payment.entity";
import { InitiatePaymentDto } from "../application/dtos/initiate-payment.dto";

export class PaymentRepository implements IPaymentRepository {
  async initiate(
    orderId: string,
    dto: InitiatePaymentDto
  ): Promise<PaymentInitiation> {
    const url = `orders/${orderId}/pay`;
    try {
      const response = await api.post(url, dto);
      return response.data;
    } catch (error) {
      console.error(
        `[PaymentRepository] Error initiating payment for order ${orderId}:`,
        error
      );
      throw error;
    }
  }

  async getStatus(orderId: string): Promise<Order> {
    const url = `orders/${orderId}/payment-status`;
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(
        `[PaymentRepository] Error fetching payment status for order ${orderId}:`,
        error
      );
      throw error;
    }
  }
}
