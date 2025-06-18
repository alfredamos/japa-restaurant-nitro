import { UserDb } from "~~/utils/db/user.db";

export const deleteUserByIdAction = async (id: string) => {
  //----> Delete the user from the database.
  const deletedUser = await UserDb.deletedUser(id);
  //----> Send back the response.
  return deletedUser;
};

export const getAllUsersAction = async () => {
  //----> Get all users from the database.
  const users = await UserDb.getAllUsers();
  //----> Send back the response.
  return users;
};

export const getUserByIdAction = async (id: string) => {
  console.log("In get-one-user, id : ", id)
  //----> Retrieve user from database.
  const user = await UserDb.detailUser(id);
  //----> Send back the response back.
  return user;
};
