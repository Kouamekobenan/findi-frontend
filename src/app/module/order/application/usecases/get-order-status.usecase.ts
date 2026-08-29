import { IOrderRepository } from "../../domain/interfaces/order-repository.interface";
import { Order } from "../../domain/entities/order.entity";

export class GetOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string): Promise<Order> {
    return await this.orderRepository.getById(orderId);
  }
}
