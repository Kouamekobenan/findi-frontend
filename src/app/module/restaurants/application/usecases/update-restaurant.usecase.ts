import { UpdateRestaurantDto } from "../dtos/update-restaurants.dto";
import { IRestaurantRepository } from "../../domain/interface/restaurant-repository.interface";

export class UpdateRestaurantUseCase {
  constructor(private readonly restaurantRepo: IRestaurantRepository) {}
  async execute(
    id: string,
    updateDto: UpdateRestaurantDto,
    file?: File | null
  ) {
    return await this.restaurantRepo.update(id, updateDto, file);
  }
}
