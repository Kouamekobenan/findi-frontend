import { IRestaurantDishRepository } from "../../domain/interfaces/restaurantDish-repository.impl";
export class DeleteRestaurantDishUsecase {
  constructor(private restaurantDishRepo: IRestaurantDishRepository) {}
  async execute(id: string): Promise<void> {
    await this.restaurantDishRepo.delete(id);
  }
}
