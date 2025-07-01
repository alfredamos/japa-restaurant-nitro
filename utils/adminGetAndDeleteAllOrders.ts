import { StatusCodes } from "http-status-codes";
import { useAuth } from "./useAuth";

export function getAndDeleteAllOrders(){
  //----> Get the isAdmin flag.
  const { isUserAdmin } = useAuth();
  const isAdmin = isUserAdmin();
  
  //----> Check for same user and admin user.
  if (!isAdmin) {
    throw createError({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "You are not authorized on this page!",
      statusMessage: "Not Authorized",
      stack: "Access denied!"
    });
  } 
  
}