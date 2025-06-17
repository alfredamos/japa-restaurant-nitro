import { currentUserAction } from "~~/utils/actions/auth.action";
import { useAuth } from "~~/utils/useAuth"

export default defineEventHandler(async(event) => {
  const {getCurrentUserId} = useAuth();
  const userId = getCurrentUserId();
  console.log("In current-user, userId : ", userId);
  const currentUser = await currentUserAction(userId);

  return currentUser;
})