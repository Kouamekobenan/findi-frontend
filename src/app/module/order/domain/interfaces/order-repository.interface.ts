import { Order } from "../entities/order.entity";
import { CreateOrderDto } from "../../application/dtos/create-order.dto";

export interface IOrderRepository {
  create(dto: CreateOrderDto): Promise<Order>;
  getById(id: string): Promise<Order>;
}
