export interface CreateDishDto {
  restaurantId: string;
  dishId: string;
  price: number;
  currency: string;
  description: string;
  isAvailable: boolean;
}
