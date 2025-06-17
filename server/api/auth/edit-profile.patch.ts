import { EditProfileModel } from "~~/models/auth/editProfile.model"
import { editProfileSchema } from "./../../../utils/validations/auth.validation";
import { editProfileAction } from "~~/utils/actions/auth.action";

export default defineEventHandler(async(event) => {
  const validatedBody = await readValidatedBody(event, (body) => editProfileSchema.parse(body)) as EditProfileModel;
    
    const response = await editProfileAction(validatedBody);
  
    return response;
})