import { Role } from "../role.model";

export class AuthUserModel{
  id: string = "";
  name: string = "";
  role: Role = Role.User;
  token: string = "";

}