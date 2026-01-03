import { IRestaurantDishRepository } from "../../domain/interfaces/restaurantDish-repository.impl";

export class FindDishByDishNameUsecase {
  constructor(private restaurantDishRepository: IRestaurantDishRepository) {}
  async execute(page: number, limit: number, dishName: string) {
    return this.restaurantDishRepository.findName(page, limit, dishName);
  }
}
