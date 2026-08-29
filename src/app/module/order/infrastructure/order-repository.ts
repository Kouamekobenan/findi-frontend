import { api } from "@/app/prisma/api";
import { Order } from "../domain/entities/order.entity";
import { IOrderRepository } from "../domain/interfaces/order-repository.interface";
import { CreateOrderDto } from "../application/dtos/create-order.dto";

export class OrderRepository implements IOrderRepository {
  async create(dto: CreateOrderDto): Promise<Order> {
    const url = "orders";
    try {
      const response = await api.post(url, dto);
      return response.data;
    } catch (error) {
      console.error("[OrderRepository] Error creating order:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<Order> {
    const url = `orders/${id}`;
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`[OrderRepository] Error fetching order ${id}:`, error);
      throw error;
    }
  }
}
