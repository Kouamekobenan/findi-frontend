import { api } from "@/app/prisma/api";
import { PaginatedResult } from "../../common/type-generique";
import { Restaurant } from "../domain/entities/restaurant.entity";
import { IRestaurantRepository } from "../domain/interface/restaurant-repository.interface";
import { UpdateRestaurantDto } from "../application/dtos/update-restaurants.dto";
import { CreateRestaurantDto } from "../application/dtos/create-restaurant.dto";

export class RestaurantRepository implements IRestaurantRepository {
  async create(
    dto: CreateRestaurantDto,
    file?: File | null
  ): Promise<Restaurant> {
    const url = "/restaurant";
    let response;

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      (Object.keys(dto) as Array<keyof CreateRestaurantDto>).forEach((key) => {
        const value = dto[key];
        if (value !== undefined && value !== null) {
          if (key === "openingHours") {
            formData.append(key, JSON.stringify(value));
          } else {
            // Cast en string pour le FormData
            formData.append(key, String(value));
          }
        }
      });

      response = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await api.post(url, dto);
    }
    return response.data;
  }
  async findAll(
    limit: number,
    page: number
  ): Promise<PaginatedResult<Restaurant>> {
    const url = "/restaurant/paginate";
    const resposne = await api.get(url, {
      params: {
        limit,
        page,
      },
    });
    return {
      data: resposne.data.data,
      totalPage: resposne.data.totalPage,
      total: resposne.data.total,
      page: resposne.data.page,
      limit: resposne.data.limit,
    };
  }
  async update(
    id: string,
    updateDto: UpdateRestaurantDto,
    file?: File | null
  ): Promise<Restaurant> {
    const url = `/restaurant/${id}`;
    let response;
    if (file) {
      const formData = new FormData();
      // 1. Ajouter le fichier séparément
      formData.append("image", file);
      // 2. Boucler sur les clés du DTO pour remplir le FormData
      (Object.keys(updateDto) as Array<keyof UpdateRestaurantDto>).forEach(
        (key) => {
          const value = updateDto[key];
          // On n'ajoute au FormData que si la valeur n'est pas undefined ou null
          if (value !== undefined && value !== null) {
            if (key === "openingHours") {
              // On transforme l'objet en chaîne JSON pour éviter l'erreur d'overload
              formData.append(key, JSON.stringify(value));
            } else {
              // Pour les strings (name, address, etc.), on cast en string par sécurité
              formData.append(key, value as string);
            }
          }
        }
      );
      const response = await api.patch(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } else {
      response = await api.patch(url, updateDto);
    }
    return response.data;
  }
}
