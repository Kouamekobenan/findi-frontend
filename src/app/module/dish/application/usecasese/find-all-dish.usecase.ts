import { IDishRepository } from "../../domain/interface/dish-repository.interface";
export class FindAllDishUsecase {
  constructor(private dishRepo: IDishRepository) {}
  async execute() {
    return this.dishRepo.getAll();
  }
}
