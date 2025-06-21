import { StatusCodes } from "http-status-codes";
import { getUserByIdAction } from "~~/utils/actions/user.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  //----> Get same user and is-admin flags.
    const {checkForSameUserAndAdmin} = useAuth();
    const {isAdmin, isSameUser} = checkForSameUserAndAdmin(id);
  
    //----> Check for same user and admin user.
    if (!isAdmin && !isSameUser){
      sendError(
        event,
        createError({
          statusCode: StatusCodes.UNAUTHORIZED,
          statusMessage: "You are not authorized to delete these orders!",
        })
      );
    }

  const response = await getUserByIdAction(id);

  return response;
});
