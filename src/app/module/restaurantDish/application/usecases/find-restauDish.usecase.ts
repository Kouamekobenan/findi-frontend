import { IRestaurantDishRepository } from "../../domain/interfaces/restaurantDish-repository.impl";
import { RestaurantDish } from "../../domain/entities/restauDish.entity";

export class FindRestauDishUseCase {
  constructor(
    private readonly restaurantDishRepository: IRestaurantDishRepository
  ) {}
  async execute(id: string): Promise<RestaurantDish> {
    try {
      return await this.restaurantDishRepository.findById(id);
    } catch (error) {
      throw new Error("Error finding restaurant dish:" + error);
    }
  }
}
