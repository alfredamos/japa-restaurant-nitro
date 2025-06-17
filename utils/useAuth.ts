import { StatusCodes } from "http-status-codes";
import { ResponseAuth } from "~~/models/auth/CookieResponse";
import jwt from "jsonwebtoken"
import { initialUserCredential } from "./initialUserCredentials";
import { TokenJwt } from "~~/models/auth/TokenJwt";
import { Role } from "@prisma/client";
import { isProtectedRoute } from "./protectedRoute";

export function useAuth(){
  //----> get global event.
  const event = useEvent();
  let token = "";
  let userId = "";
  //----> Get jwt-secret.
  const secret = useRuntimeConfig(event)?.jwtTokenSecret;

  //----> Set the auth.
  const setAuth = (authRes: ResponseAuth)  => {
    //----> Turn object value into a string
    const value = JSON.stringify(authRes);

    //----> Set the cookie globally
    setCookie(event, 'auth', value, {
      httpOnly: true
    });

    //----> Add user auth-response to context
    event.context.user = {...authRes};
  }

  //----> Remove the auth.
  const removeAuth = () =>{
    //----> Delete the cookie - Token removed.    
    deleteCookie(event, 'auth', {
      httpOnly: true
    });

    //----> Get the current cookie.
    const currentCookieObject = getCurrentCookie()
    
    const objectValue = !!currentCookieObject? currentCookieObject : initialUserCredential;
    
    //----> get the latest token
    token = objectValue?.token
 
    //----> User is now set at default.
    event.context.user = initialUserCredential;
    
  }

  //----> Get the auth.
  const getAuth = () => {
    //----> Extract token
    token = extractToken() as string;

    //----> Check if user already logged-out.
     if(!token){
      if(event._path === "/api/auth/logout")return sendError(event, createError({statusCode: StatusCodes.UNAUTHORIZED, statusMessage: "You are already logged out!"}))
    }

    //----> Check for empty token
    if(!token){
      if(event._path === "/api/auth/logout")return sendError(event, createError({statusCode: StatusCodes.UNAUTHORIZED, statusMessage: "You are already logged out!"}))
      return sendError(event, createError({statusCode: StatusCodes.UNAUTHORIZED, statusMessage: "Invalid credential!"}))
    }

    //----> Check token validity
    const verifiedToken = checkToKenValidity(token);

    //---->Check for empty token
    if(!verifiedToken){
      return sendError(event, createError({statusCode: StatusCodes.UNAUTHORIZED, statusMessage: "Invalid credentials!"}))
    }
  
    //----> Get token object value (consisting of id, name, role etc)
    const jwtToken = verifiedToken as TokenJwt;
  
    //----> Get the user role from the token object.
    const userRole = jwtToken?.role;
    const isName = jwtToken?.name;
    const userId = jwtToken?.id;
    //----> Check for admin role.
    const isAuthorizedUser = (userRole === Role.User) || (userRole === Role.Staff);

    //----> Return the response
    if (isAuthorizedUser && isName && userId) return true;
    return false;
  }

  const adminUser = () =>{
    //----> Extract-token.
    token = extractToken() as string;
    
    //----> Check token validity
    const verifiedToken = checkToKenValidity(token);
    
    //----> Check for empty token.
    if(!verifiedToken){
      return sendError(event, createError({statusCode: StatusCodes.UNAUTHORIZED, statusMessage: "Invalid credentials!"}))
    }
  
    //----> Get token object value (consisting of id, name, role etc)
    const jwtToken = verifiedToken as TokenJwt;

    //----> Check for protected-routes
    if(isProtectedRoute(event._path)) return;
  
    //----> Get the user role from the token object.
    const userRole = jwtToken?.role;

    //----> Check for admin role.
    const isAdmin = userRole === Role.Admin;

    //----> Return the response
    if (isAdmin) return true;
    else{
      return sendError(event, createError({statusCode: StatusCodes.FORBIDDEN, statusMessage: "You are not permitted to view this page!"}));
    }; 
  }

  const extractToken = () => {
    //----> Extract the cookie object from string values.
    const authCookieObject = getCurrentCookie();

    //----> Get jwt-token.
    const {token} = authCookieObject;

    //----> Check for empty token.
    if(!token){
        return sendError(event, createError({statusCode: StatusCodes.UNAUTHORIZED, statusMessage: "Invalid credentials!"}))
      }
  
    return token;
  }

  const checkToKenValidity = (token: string) => {
//----> Verify the jwt-token
    const verifiedToken = jwt?.verify(token, secret);
    
    //----> Check for empty string.
    if(!verifiedToken){
      return sendError(event, createError({statusCode: StatusCodes.UNAUTHORIZED, statusMessage: "Invalid credentials!"}))
    
    }

    //----> Return JwtToken
    return verifiedToken;
    
  }

  const getCurrentCookie = () => {
    //----> Get the current cookie.
    const currentCookie = getCookie(event, 'auth') || JSON.stringify(initialUserCredential);
    //----> Extract the cookie object from string values.
    const authCookieObject = JSON.parse(currentCookie) as ResponseAuth;

    return authCookieObject;
  }

  const getCurrentUserId = () => {
    //----> Get current cookie.
    const currentCookie = getCurrentCookie();

    //----> Get the current userId.
    userId = currentCookie?.id;

    return userId
  }

  const isUserAdmin = () => {
    //----> Get current cookie.
    const currentCookie = getCurrentCookie();

    return currentCookie?.isAdmin;
  }

  const isUserAuthenticated = () => {
    //----> Get current cookie.
    const currentCookie = getCurrentCookie();

    return currentCookie?.isLoggedIn;
  }

  const urlOrigin = () => {
    const origin = event.headers.get('origin')
    return {origin}
  }

  return{
    adminUser,
    getAuth,
    isUserAdmin,
    isUserAuthenticated,
    removeAuth,
    setAuth,
    getCurrentUserId,
    urlOrigin
  }
}