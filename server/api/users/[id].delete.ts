import { StatusCodes } from "http-status-codes";
import { deleteUserByIdAction } from "~~/utils/actions/user.action";
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
          statusMessage: "You are not authorized to delete this user!",
        })
      );
    }

  const response = await deleteUserByIdAction(id);

  return response;
});
