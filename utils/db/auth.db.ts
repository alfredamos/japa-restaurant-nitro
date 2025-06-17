import prisma from "./prisma.db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role, type User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import type { ChangePasswordModel } from "~~/models/auth/changePassword.model";
import type { EditProfileModel } from "~~/models/auth/editProfile.model";
import type { LoginModel } from "~~/models/auth/login.model";
import type { SignupModel } from "~~/models/auth/signup.model";
import type { UserInfoModel } from "~~/models/users/userInfo.model";
import type { AuthResponseModel } from "~~/models/auth/authResponse.model";
import type { UserResponseModel } from "~~/models/users/userResponse.model";
import { ResponseAuth } from '../../models/auth/CookieResponse';
import { LoginResponse } from "~~/models/auth/loginResponse.model";

export class AuthDb {
  constructor() {}

  async changePassword(changePasswordModel: ChangePasswordModel) {
    //----> Destructure the payload.
    const { email, oldPassword, newPassword, confirmPassword } =
      changePasswordModel;

    //----> Check for password match
    if (!this.matchPassword(newPassword, confirmPassword)) {
      throw createError({statusCode:StatusCodes.BAD_REQUEST, statusMessage: "Password must match!"});
    }

    //----> Get user from database.
    const user = await this.getUserByEmail(email);

    //----> Check that the old password is correct.
    const isMatch = await this.comparePassword(oldPassword, user);
    if (!isMatch) {
      throw createError({statusCode: StatusCodes.UNAUTHORIZED, statusMessage: "Invalid credentials "});
    }

    //----> Hash the new password.
    const hashNewPassword = await this.passwordHarsher(newPassword);

    //----> Store the updated user in the database.
    const updatedUser = await prisma.user.update({
      data: { ...user, password: hashNewPassword },
      where: { email },
    });

    //----> Destructure role and password out user payload.
    const { role, password, ...restOfData } = updatedUser;

    //----> Send back the result.
    return restOfData;
  }

  async currentUser(id: string) {
    //----> Retrieve the current user from the database.
    const currentUser = await this.getUserById(id);

    //----> Remove role and password from the user object.
    const { password, ...rest } = currentUser;

    //----> Send back the result.
    return rest;
  }

  async editProfile(editProfileModel: EditProfileModel) {
    //----> Destructure the payload.
    const { email, password, ...rest } = editProfileModel;

    //----> Get the user from database.
    const user = await this.getUserByEmail(email);

    //----> Compare the new password with old password.
    await this.comparePassword(password, user);

    //----> Store the updated user in the database.
    const updatedUser = await prisma.user.update({
      data: { ...rest, password: user.password },
      where: { email },
    });

    //----> Destructure role and password out user payload
    const { role, password: userPassword, ...restOfData } = updatedUser;

    //----> Send back the result.
    return restOfData;
  }

  async getCurrentUser(email: string) {
    //----> Retrieve the current user from the database.
    const currentUser = await this.getUserByEmail(email);

    //----> Remove role and password from the user object.
    const { password, ...rest } = currentUser;

    //----> Send back the result.
    return rest;
  }

  async login(loginModel: LoginModel, secret: string) {
    //----> Destructure the payload.
    const { email, password } = loginModel;

    //----> Get the user from database.
    const user = await this.getUserByEmail(email);

    //----> Compare the new password with old password.
    await this.comparePassword(password, user);

    //----> Get json web token.
    const token = this.getJsonToken(user.id, user.name, user.role, secret);

    const { password: userPassword, ...restOfData } = user;

    //----> Destructure password out user payload.
    const authRes: ResponseAuth = {
      id: user?.id,
      name: user?.name,
      image: user?.image,
      token,
      role: user?.role,
      isLoggedIn: true,
      isAdmin: user?.role === Role.Admin,
    };

    //----> Login response data.
    const loginRes: LoginResponse = {
      authResponse: authRes,
      currentUser: user,
    };

    //----. Send back the result.
    return loginRes;
  }

  async signup(signupModel: SignupModel) {
    //----> Destructure the payload.
    const { email, password, confirmPassword, ...rest } = signupModel;

    //----> Check for password match, check for existence of user.
    await this.signupUtil(confirmPassword, email, password);

    //----> Hash the new password.
    const hashNewPassword = await this.passwordHarsher(password);

    //----> Store the new user in the database.
    const newUser = await prisma.user.create({
      data: { ...rest, password: hashNewPassword, email },
    });

    //----> Destructure the user payload to take out the password.
    const { password: userPassword, ...restOfData } = newUser;
  
    //----> Auth response.
    const authResponse: AuthResponseModel = {
      user: restOfData as UserResponseModel,
      isLoggedIn: true,
      isAdmin: newUser?.role === Role.Admin,
    };

    //----> Send back the response.
    return authResponse;
  }

  async updateUserRole(userInfo: UserInfoModel, email: string, role: Role) {
    //----> Check for admin rights.
    const isAdmin = userInfo?.role;

    //----> Check for admin privilege.
    if (!isAdmin) {
      throw createError({
        statusCode: StatusCodes.FORBIDDEN,
        statusMessage: "You are not permitted to perform this task!"
    });
    }

    //----> Get the user detail.
    const user = await prisma.user.findUnique({ where: { email } });

    //----> Check if user exist.
    if (!user) {
      throw createError({
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: "This user is not in the database!"
    });
    }

    //----> Make the user an admin.
    const userUpdated = await prisma.user.update({
      where: { email },
      data: { ...user, role },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        role: true,
        image: true

      }
    });

    //----> Send back the result.
    return userUpdated;
  }

  //----> Function to check if given password matches confirm-password.
  private matchPassword(newPassword: string, oldPassword: string) {
    return newPassword.normalize() === oldPassword.normalize();
  }

  private async getUserById(id: string,) {
    //----> Get the user.
    const user = await prisma.user.findUnique({
      where: { id },
    });
    //----> Check for existence of user.
    if (!user) {
      throw createError({statusCode: StatusCodes.NOT_FOUND, statusMessage: "Invalid credentials!"});
    }

    //----> Send back the result.
    return user;
  }

  private async getUserByEmail(email: string) {
    //----> Get user from database.
    const user = await prisma.user.findUnique({ where: { email } });

    //----> Check for existence of user.
    if (!user) {
      throw createError({statusCode: StatusCodes.NOT_FOUND, statusMessage: "Invalid credential!"});
    }

    //----> Send back the result.
    return user;
  }

  //----> This function compares the password in the database with the one supplied by user.
  private async comparePassword(oldPassword: string, user: User) {
    //----> Compare the new password with old password.
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    //----> Check if the two passwords match.
    if (!isMatch) {
      throw createError({statusCode: StatusCodes.UNAUTHORIZED, statusMessage: "Invalid credentials!"});
    }

    //----> Send back the result.
    return isMatch;
  }

  //----> This function hashes the password.
  private async passwordHarsher(newPassword: string) {
    //----> Hash the new password.
    return bcrypt.hash(newPassword, 12);
  }

  private async signupUtil(
    confirmPassword: string,
    email: string,
    password: string
  ) {
    //----> Check for password match
    if (!this.matchPassword(password, confirmPassword)) {
      throw createError({statusCode:StatusCodes.BAD_REQUEST, statusMessage: "Password must match!"});
    }

    //----> Get user from database.
    const user = await prisma.user.findUnique({ where: { email } });

    //----> Check for existence of user.
    if (user) {
      throw createError({statusCode: StatusCodes.BAD_REQUEST, statusMessage:"User already exists!"});
    }
  }

  //----> Function for checking the genuineness of token provided by logged in user. 
  private getJsonToken(id: string, name: string, role: Role, secret: string) {
    const token = jwt.sign(
      {
        id,
        name,
        role,
      },
      secret,
      { expiresIn: "24hr" }
    );

    return token;
  }

}

export const authDb = new AuthDb();
