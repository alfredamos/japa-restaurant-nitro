import { getUserByIdAction } from "~~/utils/actions/user.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  //----> Get same user and admin checker.
  const {sameUserAndAdmin} = useAuth()

  //----> Check for same user or admin.
  sameUserAndAdmin(id);

  const response = await getUserByIdAction(id);

  return response;
});
