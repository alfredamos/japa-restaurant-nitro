import { SignupModel } from "~~/models/auth/signup.model";
import { signupAction } from "~~/utils/actions/auth.action";
import { signupSchema } from "~~/utils/validations/auth.validation"

export default defineEventHandler(async(event) => {
  
  const signupModel = await readValidatedBody(event, (body) => signupSchema.parse(body)) as SignupModel;
  
  const response = await signupAction(signupModel);

  return response;
})