import { authDb } from "~~/utils/db/auth.db";
import type { ChangePasswordModel } from "~~/models/auth/changePassword.model";
import type { EditProfileModel } from "~~/models/auth/editProfile.model";
import type { LoginModel } from "~~/models/auth/login.model";
import type { SignupModel } from "~~/models/auth/signup.model";
import type { UserInfoModel } from "~~/models/users/userInfo.model";
import type { UserRoleChangeModel } from "~~/models/users/userRoleChange.model";

export async function changePasswordAction(changePasswordModel: ChangePasswordModel) {
  //----> Get the payload.
  const { email, confirmPassword, oldPassword, newPassword } =
    changePasswordModel;
  //----> Change the password and store the updated user credentials in the database.
  return await authDb.changePassword({
    email,
    confirmPassword,
    oldPassword,
    newPassword,
  });
}

export async function editProfileAction(editProfileModel: EditProfileModel) {
  //----> Get the edit-profile from form data.
  const { address, name, email, phone, image, gender, password } =
    editProfileModel;
  //----> edit user profile and store it in the database.

  const updatedUser = await authDb.editProfile({
    address,
    name,
    email,
    phone,
    image,
    gender,
    password,
  });
  //----> send back response.
  return updatedUser
}

export async function loginWithoutAuthAction(loginModel: LoginModel, secret: string){
  //----> Authenticate 
  const response = await authDb.login(loginModel, secret);

  return response
}

export async function loginAction(loginModel: LoginModel) {
  //const {signIn} = useAuth();
  //----> Get the user credentials from the request.
  const loginCredentials = loginModel;
  //----> Destructure formData.
  const { email, password } = loginCredentials;
  /* //----> Login the user in.
   return await signIn("credentials", {
    email,
    password,
    redirect: false,
  }); */  
}

export async function logoutAction() {
  //const {signOut} = useAuth()
  //await signOut({ redirect: true });
}

export async function signupAction(signupModel: SignupModel) {
  
  //----> Get the user credentials from the request.
   const {
    address,
    name,
    email,
    phone,
    image,
    confirmPassword,
    password,
    gender,
  } = signupModel;

  //----> Store the new user credentials in the database.
  const newUser = await authDb.signup({
    address,
    name,
    email,
    phone,
    image,
    gender,
    confirmPassword,
    password,
  });
  //----> send back response.

  return newUser 
}

export async function currentUserAction(id: string) {
  //----> Get the current user from the database.
  const userCurrent = await authDb.currentUser(id);

  //----> Send back the response.
  return userCurrent;
}
export async function getCurrentUserAction(email: string) {
  //----> Get the current user from the database.
  const userCurrent = await authDb.getCurrentUser(email);

  //----> Send back the response.
  return userCurrent;
}

export async function updateUserRoleAction(
  userInfo: UserInfoModel,
  userRoleChangeModel: UserRoleChangeModel
) {
  //----> Get the email and user details of person to be made admin.
  const { email, role } = userRoleChangeModel;

  //----> Change the user role and store the new credentials in the database.
  const userCredentials = await authDb.updateUserRole(userInfo, email, role);

  //----> Send back the response.
  return userCredentials;
}
