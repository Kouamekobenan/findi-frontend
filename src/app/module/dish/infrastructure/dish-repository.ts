import { api } from "@/app/prisma/api";
import { IRestaurantDishRepository } from "../../restaurantDish/domain/interfaces/restaurantDish-repository.impl";
import { UpdateDishDto } from "../application/dtos/update-dish.dto";
import { Dish } from "../domain/entities/dish.entity";
import { IDishRepository } from "../domain/interface/dish-repository.interface";

export class DishRepository implements IDishRepository {
  async update(
    id: string,
    updateDishDto: UpdateDishDto,
    file?: File | null
  ): Promise<Dish> {
    const url = `/dish/${id}`;
    let response;
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", updateDishDto.description);
      response = await api.patch(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await api.patch(url, updateDishDto);
    }
    return response.data;
  }
  
  async getAll(): Promise<Dish[]> {
    const url = `/dish`;
    const response = await api.get(url);
    return response.data;
  }
}
