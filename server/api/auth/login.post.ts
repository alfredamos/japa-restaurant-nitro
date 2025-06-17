import { LoginModel } from "~~/models/auth/login.model";
import { loginWithoutAuthAction } from "~~/utils/actions/auth.action";
import { useAuth } from "~~/utils/useAuth";
import { loginSchema } from "~~/utils/validations/auth.validation";

export default defineEventHandler(async (event) => {
  //----> Get the request body and validate it.
  const loginModel = await readValidatedBody(event, (body) => loginSchema.parse(body));
  
  //----> Get the Jwt secret.
  const secret = useRuntimeConfig()?.jwtTokenSecret;

  //----> Login
    const response = await loginWithoutAuthAction(loginModel as LoginModel, secret);
  //----> Get the set-auth-function
  const auth = useAuth();

  //----> Set the auth.
  auth.setAuth(response?.authResponse);

  //----> Return login response.
  return response;
  
  
})