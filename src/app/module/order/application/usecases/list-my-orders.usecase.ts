import { IOrderRepository } from "../../domain/interfaces/order-repository.interface";
import { Order } from "../../domain/entities/order.entity";
import { PaginatedResult } from "@/app/module/common/type-generique";

export class ListMyOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(page: number, limit: number): Promise<PaginatedResult<Order>> {
    return await this.orderRepository.paginateByUser(page, limit);
  }
}
