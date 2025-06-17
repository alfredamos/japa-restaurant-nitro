import { StatusCodes } from "http-status-codes";
import { isPublicRoutes } from "~~/utils/publicRoute";
import { useAuth } from "~~/utils/useAuth"

export default defineEventHandler(async(event) => {
  //----> Check for public route.
  const isPublic = isPublicRoutes(event._path);
  console.log("In auth-middleware");
  //----> Get use-auth.
  const {getAuth, isUserAuthenticated} = useAuth();
  //----> Check for authentication.
  const isAuthenticated = isUserAuthenticated();
  console.log({isPublic, isAuthenticated, route: event?.path})
  //----> Check for jwt availability.
  if(!isPublic && isAuthenticated)getAuth();
  else if(!isPublic && !isAuthenticated)
   throw sendError(event, createError({statusCode: StatusCodes.UNAUTHORIZED, statusMessage: "Invalid credentials!"}))
})