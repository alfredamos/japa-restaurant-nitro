import { ChangePasswordModel } from "~~/models/auth/changePassword.model"
import { changePasswordAction } from "~~/utils/actions/auth.action";
import { changePasswordSchema } from "~~/utils/validations/auth.validation"

export default defineEventHandler(async (event) => {
  const validatedBody = await readValidatedBody(event, (body) => changePasswordSchema.parse(body)) as ChangePasswordModel;

  const response = await changePasswordAction(validatedBody);

  return response;
})