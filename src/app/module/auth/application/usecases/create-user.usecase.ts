import { IUserRepository } from "../../domain/interface/user-repository";
import { RegisterDto } from "../dtos/Registere.dto";

export class RegisterUseCase {
  constructor(private readonly userRepo: IUserRepository) {}
  async execute(dto: RegisterDto) {
    return await this.userRepo.create(dto);
  }
}
