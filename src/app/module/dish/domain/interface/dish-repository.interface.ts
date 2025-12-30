import { UpdateDishDto } from "../../application/dtos/update-dish.dto";
import { Dish } from "../entities/dish.entity";

export interface IDishRepository {
  update(id: string, updateDishDto: UpdateDishDto, file?: File | null): Promise<Dish>;
  getAll(): Promise<Dish[]>;
}
