import { UserResponseModel } from "../users/userResponse.model";
import { ResponseAuth } from "./CookieResponse";

export class LoginResponse{
  authResponse: ResponseAuth;
  currentUser: UserResponseModel;
}