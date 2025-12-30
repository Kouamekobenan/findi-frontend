import { api } from "@/app/prisma/api";
import { RegisterDto } from "../application/dtos/Registere.dto";
import { User } from "../domain/entities/user.entity";
import { IUserRepository } from "../domain/interface/user-repository";

export class UserRepository implements IUserRepository {
  async create(dto: RegisterDto): Promise<User> {
    const url = "auth/register";
    const res = await api.post(url, dto);
    return res.data;
  }
}
