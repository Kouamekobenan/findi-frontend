import { Dish } from "@/app/module/dish/domain/entities/dish.entity";
import { Restaurant } from "@/app/module/restaurants/domain/entities/restaurant.entity";
export class RestaurantDish {
  constructor(
    public readonly id: string,
    public readonly restaurantId: string,
    public readonly dishId: string,
    public readonly price: number,
    public readonly currency: string,
    public readonly description: string,
    public readonly isAvailable: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly restaurant: Restaurant,
    public readonly dish?: Dish
  ) {}
}
