import { getUserByIdAction } from "~~/utils/actions/user.action";
import { sameUserAndAdmin } from "~~/utils/sameUserAndAdmin";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  //----> Check for same user or admin.
  sameUserAndAdmin(id);

  const response = await getUserByIdAction(id);

  return response;
});
