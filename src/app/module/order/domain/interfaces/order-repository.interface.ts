import { Order } from "../entities/order.entity";
import { CreateOrderDto } from "../../application/dtos/create-order.dto";
import { PaginatedResult } from "@/app/module/common/type-generique";

export interface IOrderRepository {
  create(dto: CreateOrderDto): Promise<Order>;
  getById(id: string): Promise<Order>;
  paginateByUser(page: number, limit: number): Promise<PaginatedResult<Order>>;
}
