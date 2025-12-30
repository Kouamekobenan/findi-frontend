import { PaginatedResult } from "@/app/module/common/type-generique";
import { Restaurant } from "../entities/restaurant.entity";
import { UpdateRestaurantDto } from "../../application/dtos/update-restaurants.dto";
import {
  CreateRestaurantDto,
} from "../../application/dtos/create-restaurant.dto";

export interface IRestaurantRepository {
  create(dto: CreateRestaurantDto, file?: File | null): Promise<Restaurant>;
  findAll(limit: number, page: number): Promise<PaginatedResult<Restaurant>>;
  update(
    id: string,
    updateDto: UpdateRestaurantDto,
    file?: File | null
  ): Promise<Restaurant>;
}
