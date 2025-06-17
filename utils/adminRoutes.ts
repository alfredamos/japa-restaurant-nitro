const adminRoutes = [
  '/api/pizzas/new',
  '/api/orders',
  '/api/orders/:orderId',
  '/api/users',
  '/api/users/:id',
]

export const isAdminRoute = (route: string) => adminRoutes.includes(route)