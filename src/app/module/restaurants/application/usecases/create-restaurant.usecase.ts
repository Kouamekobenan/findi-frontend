import { IRestaurantRepository } from "../../domain/interface/restaurant-repository.interface";
import { CreateRestaurantDto } from "../dtos/create-restaurant.dto";
export class CreateRestaurantUseCase {
  constructor(private readonly restaurantRepo: IRestaurantRepository) {}
  async execute(dto: CreateRestaurantDto, file?: File | null) {
    return await this.restaurantRepo.create(dto, file);
  }
}
