import { RegisterDto } from "../../application/dtos/Registere.dto";
import { User } from "../entities/user.entity";

export interface IUserRepository {
  create(dto: RegisterDto): Promise<User>;
}
