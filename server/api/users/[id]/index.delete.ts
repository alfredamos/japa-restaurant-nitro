import { deleteUserByIdAction } from "~~/utils/actions/user.action";

export default defineEventHandler(async(event) => {
  const id = getRouterParam(event, 'id');

  const response = await deleteUserByIdAction(id);

  return response;
})