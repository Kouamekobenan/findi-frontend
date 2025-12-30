import { IDishRepository } from "../../domain/interface/dish-repository.interface";
import { UpdateDishDto } from "../dtos/update-dish.dto";

export class UpdateDishUsecae {
  constructor(private dishRepo: IDishRepository) {}
  async execute(id: string, updateDishDto: UpdateDishDto, file?: File | null) {
    return this.dishRepo.update(id, updateDishDto, file);
  }
}
