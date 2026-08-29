import { IDishRepository } from "../../domain/interface/dish-repository.interface";
export class FindAllLinkedDishUsecase {
  constructor(private dishRepo: IDishRepository) {}
  async execute() {
    return this.dishRepo.getAllLinkedToRestaurant();
  }
}
