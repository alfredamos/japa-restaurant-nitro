export default defineEventHandler((event) => {
  const origin = event.headers.get('origin')
  console.log("The origin, origin : ", origin)
  //----> set cors
    setResponseHeaders(event, {
       "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "Access-Control-Allow-Origin": `${origin}`,
        'Access-Control-Allow-Credentials': 'true',
        "Access-Control-Allow-Headers": 'Content-Type, Authorization',
        "Access-Control-Expose-Headers": '*'
    })
    if (event.method === 'OPTIONS') {
        event.node.res.statusCode = 204
        event.node.res.statusMessage = "No Content."
        return 'OK'
    }
})