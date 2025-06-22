import { StatusCodes } from "http-status-codes";
import { useAuth } from "./useAuth";

export function sameUserAndAdmin(userId: string){
  //----> Get same user and is-admin flags.
    const {checkForSameUserAndAdmin} = useAuth();
    console.log("In sameUserAndAdmin-middleware");
    //----> Only run the middleware if user-id is not empty.
    if (!!userId){
      const { isAdmin, isSameUser } = checkForSameUserAndAdmin(userId);
      //----> Check for same user and admin user.
      if (!isAdmin && !isSameUser) {
        throw createError({
          statusCode: StatusCodes.UNAUTHORIZED,
          message: "You are not authorized on this page!",
          statusMessage: "Not Authorized",
          stack: undefined,
        });
      }
    }
}