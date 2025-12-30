import { IRestaurantDishRepository } from "../../domain/interfaces/restaurantDish-repository.impl";

export class FindDishByCityUsecase {
  constructor(private restaurantDishRepository: IRestaurantDishRepository) {}
  async execute(page: number, limit: number, cityName: string) {
    return this.restaurantDishRepository.paginate(page, limit, cityName);
  }
}
