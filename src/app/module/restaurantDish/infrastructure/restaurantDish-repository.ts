import { api } from "@/app/prisma/api"; // Vérifie si ce nom est pertinent (Axios ?)
import { RestaurantDish } from "../domain/entities/restauDish.entity";
import { IRestaurantDishRepository } from "../domain/interfaces/restaurantDish-repository.impl";
import { PaginatedResult } from "../../common/type-generique";
import { CreateDishDto } from "../application/dtos/createDish.dto";
import { UpdateRestaurantDishDto } from "../application/dtos/update.dto";

export class RestaurantDishRepository implements IRestaurantDishRepository {
  async create(dto: CreateDishDto): Promise<RestaurantDish> {
    const url = "restaurantDish";
    const response = await api.post(url, dto);
    return response.data;
  }
  async findById(id: string): Promise<RestaurantDish> {
    const url = `restaurantDish/restaurant/${id}`;
    try {
      const response = await api.get(url);

      // Retourne directement la donnée si elle existe, sinon null
      return response.data ?? null;
    } catch (error) {
      // Log l'erreur pour le debug mais ne fait pas crash l'app
      console.error(
        `[RestaurantDishRepository] Error fetching id ${id}:`,
        error
      );
      throw error; // Rejette l'erreur pour que l'appelant puisse la gérer
    }
  }
  async paginate(
    page: number,
    limit: number,
    cityName: string
  ): Promise<PaginatedResult<RestaurantDish>> {
    const url = `restaurantDish/paginate?page=${page}&limit=${limit}&countryName=${cityName}`;
    try {
      const response = await api.get(url);
      return {
        data: response.data.data,
        total: response.data.total,
        totalPage: response.data.totalPage,
        limit: response.data.limit,
        page: response.data.page,
      };
    } catch (error) {
      console.error(
        `[RestaurantDishRepository] Error paginating dishes:`,
        error
      );
      throw error;
    }
  }
  async delete(id: string): Promise<void> {
    const url = `restaurantDish/${id}`;
    await api.delete(url);
  }
  async update(
    id: string,
    dto: UpdateRestaurantDishDto
  ): Promise<RestaurantDish> {
    const url = `restaurantDish/${id}`;
    const response = await api.patch(url, dto);
    return response.data;
  }
  async findName(page: number, limit: number, dishName: string): Promise<PaginatedResult<RestaurantDish>> {
     const url = `restaurantDish/dish?page=${page}&limit=${limit}&dishName=${dishName}`;
     try {
       const response = await api.get(url);
       return {
         data: response.data.data,
         total: response.data.total,
         totalPage: response.data.totalPage,
         limit: response.data.limit,
         page: response.data.page,
       };
     } catch (error) {
       console.error(
         `[RestaurantDishRepository] Error paginating dishes:`,
         error
       );
       throw error;
     }
  }
}
