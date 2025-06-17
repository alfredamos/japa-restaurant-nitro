import { getAllUsersAction } from "~~/utils/actions/user.action"

export default defineEventHandler(async() => {
  const response = await getAllUsersAction();

  return response;
})