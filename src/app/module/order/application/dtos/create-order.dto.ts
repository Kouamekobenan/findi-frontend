export interface CreateOrderItemDto {
  restaurantDishId: string;
  quantity: number;
}

export interface CreateOrderDto {
  restaurantId: string;
  items: CreateOrderItemDto[];
}
