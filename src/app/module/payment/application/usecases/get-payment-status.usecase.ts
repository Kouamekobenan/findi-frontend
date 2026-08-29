import { Order } from "@/app/module/order/domain/entities/order.entity";
import { IPaymentRepository } from "../../domain/interfaces/payment-repository.interface";

export class GetPaymentStatusUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(orderId: string): Promise<Order> {
    return await this.paymentRepository.getStatus(orderId);
  }
}
