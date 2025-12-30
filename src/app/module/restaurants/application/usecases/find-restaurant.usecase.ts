import { IRestaurantRepository } from "../../domain/interface/restaurant-repository.interface";

export class FindRestaurantUsecase {
  constructor(private restaurantRepository: IRestaurantRepository) {}
  async execute(limit: number, page: number) {
    try {
      return this.restaurantRepository.findAll(limit, page);
    } catch (error) {
      throw new Error("Error fetching restaurants: " + error);
    }
  }
}
