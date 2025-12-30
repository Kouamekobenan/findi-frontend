import { RestaurantDish } from "../../domain/entities/restauDish.entity";
import { IRestaurantDishRepository } from "../../domain/interfaces/restaurantDish-repository.impl";
import { CreateDishDto } from "../dtos/createDish.dto";

export class CreateRestauDishUseCase {
  constructor(private restaurantDishRepository: IRestaurantDishRepository) {}
  async execute(dto: CreateDishDto): Promise<RestaurantDish> {
    return this.restaurantDishRepository.create(dto);
  }
}
