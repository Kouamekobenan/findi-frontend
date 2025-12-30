import { UseRole } from "../../domain/enums/enum.user.role";

export interface RegisterDto{
    email:string,
    password:string,
    name:string,
    role:UseRole
}