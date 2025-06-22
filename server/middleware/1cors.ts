import { useAuth } from "~~/utils/useAuth"

export default defineEventHandler((event) => {
  //----> Get herder origin
  const origin = event.headers.get('origin')
  
  //----> Get useAuth
  const auth = useAuth()

  //----> Set cors herders.
  auth.setCorsHerders(origin)
    
})

