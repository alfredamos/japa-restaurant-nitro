import { StatusCodes } from "http-status-codes";
import { ResponseAuth } from "~~/models/auth/CookieResponse";
import jwt from "jsonwebtoken";
import { initialUserCredential } from "./initialUserCredentials";
import { TokenJwt } from "~~/models/auth/TokenJwt";
import { Role } from "@prisma/client";
import { isProtectedRoute } from "./protectedRoute";
import { getOrderByIdAction } from "./actions/order.action";

export function useAuth() {
  //----> get global event.
  const event = useEvent();
  let token = "";
  let userId = "";
  //----> Get jwt-secret.
  const secret = useRuntimeConfig(event)?.jwtTokenSecret;

  //----> Set the auth.
  const setAuth = (authRes: ResponseAuth) => {
    //----> Turn object value into a string
    const value = JSON.stringify(authRes);

    //----> Set the cookie globally
    setCookie(event, "auth", value, {
      httpOnly: true,
    });

    //----> Add user auth-response to context
    event.context.user = { ...authRes };
  };

  //----> Remove the auth.
  const removeAuth = () => {
    //----> Delete the cookie - Token removed.
    deleteCookie(event, "auth", {
      httpOnly: true,
    });

    //----> Get the current cookie.
    const currentCookieObject = getCurrentCookie();

    const objectValue = !!currentCookieObject
      ? currentCookieObject
      : initialUserCredential;

    //----> get the latest token
    token = objectValue?.token;

    //----> User is now set at default.
    event.context.user = initialUserCredential;
  };

  //----> Get the auth.
  const getAuth = () => {
    //----> Get the current user info.
    const { isAuthorizedUser, userName: isName } = currentUserInfo();

    //----> Return the response
    if (isAuthorizedUser && isName && userId) return true;
    return false;
  };

  const currentUserInfo = () => {
    //----> Get verified token.
    const { jwtToken } = getVerifiedToken();

    //----> Get the user role from the token object.
    const { isAuthorizedUser, userName, userId, userRole } =
      getUserInfoFromToken(jwtToken);

    return { isAuthorizedUser, userName, userId, userRole };
  };

  const getVerifiedToken = () => {
    //----> Extract token
    token = extractToken() as string;

    //----> Check if user already logged-out.
    checkOutForLogoutUser(token);

    //----> Check token validity
    const verifiedToken = checkToKenValidity(token);

    //---->Check for empty token
    checkForEmptyToken(verifiedToken);

    //----> Get token object value (consisting of id, name, role etc)
    const jwtToken = verifiedToken as TokenJwt;

    return { jwtToken };
  };

  const checkForEmptyToken = (
    verifiedToken: string | void | jwt.JwtPayload
  ) => {
    if (!verifiedToken) {
      return sendError(
        event,
        createError({
          statusCode: StatusCodes.UNAUTHORIZED,
          statusMessage: "Invalid credentials!",
          stack: "Access denied!",
        })
      );
    }
  };

  const checkOutForLogoutUser = (token: string) => {
    if (!token) {
      if (event._path === "/api/auth/logout")
        return sendError(
          event,
          createError({
            statusCode: StatusCodes.UNAUTHORIZED,
            stack: "Access denied!",
          })
        );
    }

    //----> Check for empty token
    if (!token) {
      if (event._path === "/api/auth/logout")
        return sendError(
          event,
          createError({
            statusCode: StatusCodes.UNAUTHORIZED,
            statusMessage: "You are already logged out!",
            stack: "Access denied!",
          })
        );
      return sendError(
        event,
        createError({
          statusCode: StatusCodes.UNAUTHORIZED,
          statusMessage: "Invalid credential!",
          stack: "Access denied!",
        })
      );
    }
  };

  const getUserInfoFromToken = (token: TokenJwt) => {
    //----> Get the user role from the token object.
    const userRole = token?.role;
    const userName = token?.name;
    const userId = token?.id;

    //----> Check for admin role.
    const isAuthorizedUser = userRole === Role.User || userRole === Role.Staff;

    return { isAuthorizedUser, userRole, userName, userId };
  };

  const adminUser = () => {
    //----> Extract-token.
    token = extractToken() as string;

    //----> Check token validity
    const verifiedToken = checkToKenValidity(token);

    //----> Check for empty token.
    if (!verifiedToken) {
      return sendError(
        event,
        createError({
          statusCode: StatusCodes.UNAUTHORIZED,
          statusMessage: "Invalid credentials!",
          stack: "Access denied!",
        })
      );
    }

    //----> Get token object value (consisting of id, name, role etc)
    const jwtToken = verifiedToken as TokenJwt;

    //----> Check for protected-routes
    if (isProtectedRoute(event._path)) return;

    //----> Get the user role from the token object.
    const userRole = jwtToken?.role;

    //----> Check for admin role.
    const isAdmin = userRole === Role.Admin;

    //----> Return the response
    if (isAdmin) return true;
    else {
      return sendError(
        event,
        createError({
          statusCode: StatusCodes.FORBIDDEN,
          statusMessage: "You are not permitted to view this page!",
          stack: "Access denied!",
        })
      );
    }
  };

  const extractToken = () => {
    //----> Extract the cookie object from string values.
    const authCookieObject = getCurrentCookie();

    //----> Get jwt-token.
    const { token } = authCookieObject;

    //----> Check for empty token.
    if (!token) {
      return sendError(
        event,
        createError({
          statusCode: StatusCodes.UNAUTHORIZED,
          statusMessage: "Invalid credentials!",
          stack: "Access denied!",
        })
      );
    }

    return token;
  };

  const checkToKenValidity = (token: string) => {
    //----> Verify the jwt-token
    const verifiedToken = jwt?.verify(token, secret);

    //----> Check for empty string.
    if (!verifiedToken) {
      return sendError(
        event,
        createError({
          statusCode: StatusCodes.UNAUTHORIZED,
          statusMessage: "Invalid credentials!",
          stack: "Access denied!",
        })
      );
    }

    //----> Return JwtToken
    return verifiedToken;
  };

  const getCurrentCookie = () => {
    //----> Get the current cookie.
    const currentCookie =
      getCookie(event, "auth") || JSON.stringify(initialUserCredential);
    //----> Extract the cookie object from string values.
    const authCookieObject = JSON.parse(currentCookie) as ResponseAuth;

    return authCookieObject;
  };

  const getCurrentUserId = () => {
    //----> Get current cookie.
    const currentCookie = getCurrentCookie();

    //----> Get the current userId.
    userId = currentCookie?.id;

    return userId;
  };

  const isUserAdmin = () => {
    //----> Get current cookie.
    const currentCookie = getCurrentCookie();

    return currentCookie?.isAdmin;
  };

  const isUserAuthenticated = () => {
    //----> Get current cookie.
    const currentCookie = getCurrentCookie();

    return currentCookie?.isLoggedIn;
  };

  const urlOrigin = () => {
    const origin = event.headers.get("origin");
    return { origin };
  };

  const setCorsHerders = (origin: string) => {
    //----> Set access control for cors.
    setResponseHeaders(event, {
      "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "Access-Control-Allow-Origin": `${origin}`,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Expose-Headers": "*",
    });

    //----> Check for options.
    if (event.method === "OPTIONS") {
      event.node.res.statusCode = 204;
      event.node.res.statusMessage = "No Content.";
      return "OK";
    }
  };

  const checkForSameUserAndAdmin = (userId: string) => {
    //----> Get the current user info.
    const { userId: userIdFromAuth, userRole } = currentUserInfo();

    //----> Check for admin.
    const isAdmin = userRole === Role.Admin;

    //----> Check for same-user.
    const isSameUser = userIdFromAuth.normalize() === userId.normalize();

    //----> Send back the response.
    return { isAdmin, isSameUser };
  };

  const checkForOwnershipAndAdmin = async (id: string) => {
    //----> Get the order.
    const order = await getOrderByIdAction(id);
    const userIdFromOrder = order?.userId;

    //----> Get the current user info.
    const { userId, userRole } = currentUserInfo();

    //----> Check for admin.
    const isAdmin = userRole === Role.Admin;

    //----> Check for ownership.
    const isOwner = userId.normalize() === userIdFromOrder.normalize();

    //----> Send back results.
    return { isAdmin, isOwner };
  };

  const ownerAndAdmin = async (orderId: string) => {
    //const { checkForOwnershipAndAdmin } = useAuth();
    console.log("In ownerAndAdmin-middleware, orderId : ", orderId);
    //----> Run the middleware only when order-id is not null.
    if (!!orderId) {
      const { isAdmin, isOwner } = await checkForOwnershipAndAdmin(orderId);
      console.log({ isAdmin, isOwner });
      //----> Check for ownership and admin user.
      if (!isAdmin && !isOwner) {
        throw createError({
          statusCode: StatusCodes.UNAUTHORIZED,
          message: "You are not authorized on this page!",
          statusMessage: "Not Authorized",
          stack: "Access denied!",
        });
      }
    }
  };

  const sameUserAndAdmin = (userId: string) => {
    //----> Get same user and is-admin flags.
    //const { checkForSameUserAndAdmin } = useAuth();
    console.log("In sameUserAndAdmin-middleware");
    //----> Only run the middleware if user-id is not empty.
    if (!!userId) {
      const { isAdmin, isSameUser } = checkForSameUserAndAdmin(userId);
      //----> Check for same user and admin user.
      if (!isAdmin && !isSameUser) {
        throw sendError(
          event,
          createError({
            statusCode: StatusCodes.UNAUTHORIZED,
            message: "You are not authorized on this page!",
            statusMessage: "Not Authorized",
            stack: "Access denied!",
          })
        );
      }
    }
  };

  //----> send back the response.
  return {
    adminUser,
    getAuth,
    isUserAdmin,
    isUserAuthenticated,
    ownerAndAdmin,
    removeAuth,
    setAuth,
    getCurrentUserId,
    urlOrigin,
    sameUserAndAdmin,
    setCorsHerders,
  };
}
