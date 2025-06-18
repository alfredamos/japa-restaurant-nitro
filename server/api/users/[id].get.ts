import { getUserByIdAction } from "~~/utils/actions/user.action";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  const response = await getUserByIdAction(id);

  return response;
});
