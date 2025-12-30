import { RestaurantDish } from "../../domain/entities/restauDish.entity";
import { IRestaurantDishRepository } from "../../domain/interfaces/restaurantDish-repository.impl";
import { UpdateRestaurantDishDto } from "../dtos/update.dto";

export class UpdateRestaurantDishUsecase {
  constructor(private restaurantDishRepo: IRestaurantDishRepository) {}
  async execute(
    id: string,
    dto: UpdateRestaurantDishDto
  ): Promise<RestaurantDish> {
    return this.restaurantDishRepo.update(id, dto);
  }
}
