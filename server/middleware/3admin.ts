import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler((event) => {
  console.log("In admin-middleware, path : ", event._path);
  //----> Get use-auth.
  const {adminUser, isUserAdmin} = useAuth();

  //----> Check for admin privilege.
  const isAdmin = isUserAdmin();

  console.log({isAdmin})
  
  //----> Call admin-user to invoke admin privilege.
  if(isUserAdmin()){
     adminUser();
  }
})