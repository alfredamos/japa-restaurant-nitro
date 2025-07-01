import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler((event) => {
  //----> Get use-auth.
  const {adminUser, isUserAdmin} = useAuth();

  //----> Check for admin privilege.
  const isAdmin = isUserAdmin();

  //----> Call admin-user to invoke admin privilege.
  if(isUserAdmin()){
     adminUser();
  }
})