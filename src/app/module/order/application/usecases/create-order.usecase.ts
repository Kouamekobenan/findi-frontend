import { IOrderRepository } from "../../domain/interfaces/order-repository.interface";
import { Order } from "../../domain/entities/order.entity";
import { CreateOrderDto } from "../dtos/create-order.dto";

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    if (!dto.items.length) {
      throw new Error("La commande doit contenir au moins un plat");
    }
    return await this.orderRepository.create(dto);
  }
}
