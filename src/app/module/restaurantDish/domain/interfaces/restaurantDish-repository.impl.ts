import { PaginatedResult } from "@/app/module/common/type-generique";
import { RestaurantDish } from "../entities/restauDish.entity";
import { CreateDishDto } from "../../application/dtos/createDish.dto";
import { UpdateRestaurantDishDto } from "../../application/dtos/update.dto";
export interface IRestaurantDishRepository {
  create(dto: CreateDishDto): Promise<RestaurantDish>;
  findById(id: string): Promise<RestaurantDish>;
  paginate(
    page: number,
    limit: number,
    cityName: string
  ): Promise<PaginatedResult<RestaurantDish>>;
  delete(id: string): Promise<void>;
  update(id: string, dto: UpdateRestaurantDishDto, file?: File | null): Promise<RestaurantDish>;
}
