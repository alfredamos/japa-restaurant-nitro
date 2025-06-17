const publicRoutes = ['/api/auth/login', '/api/auth/signup', '/api/pizzas'];

export const isPublicRoutes = (route: string) => {

  return publicRoutes.includes(route)
}
