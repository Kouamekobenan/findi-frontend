import { Restaurant } from "@/app/module/restaurants/domain/entities/restaurant.entity";
import { UseRole } from "../enums/enum.user.role";

export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public name: string,
    public role: UseRole,
    public createdAt: Date,
    public updatedAt: Date,
    public restaurants?: Restaurant[]
  ) {}
}
