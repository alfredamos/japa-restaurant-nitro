const protectedRoute = [
  '/api/orders/:userId',
  '/api/auth/change-password',
  '/api/auth/edit-profile/',
  '/api/auth/logout',

];

export const isProtectedRoute = (route: string) => protectedRoute.includes(route);