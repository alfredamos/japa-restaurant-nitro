import { initialUserCredential } from '~~/utils/initialUserCredentials';
import { useAuth } from '~~/utils/useAuth';
export default defineEventHandler((event) => {
  //----> Get the remove-auth-function
  const auth = useAuth();

  //----> Delete the auth.
  auth.removeAuth();

  //----> Return empty auth-response.
  return initialUserCredential
})