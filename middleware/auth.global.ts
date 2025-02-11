import { useAuthStore } from "~/stores/auth";

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore() as {
    isAuthenticated: boolean;
    userRole: "admin" | "concierge" | "resident";
  };
  const publicRoutes = ["/login"];

  // Rutas públicas
  if (publicRoutes.includes(to.path)) {
    if (auth.isAuthenticated) {
      // Si está autenticado, redirigir a su dashboard
      return navigateTo(`/${auth.userRole}`);
    }
    return;
  }

  // Verificar autenticación
  if (!auth.isAuthenticated) {
    return navigateTo("/login");
  }

  // Rutas por rol
  const allowedRoutes = {
    admin: [
      "/admin",
      "/residents",
      "/expenses",
      "/facilities",
      "/notifications",
    ],
    concierge: ["/concierge", "/visits", "/packages"],
    resident: ["/resident", "/my-expenses", "/my-packages"],
  };

  // Verificar permisos de ruta según rol
  if (
    !allowedRoutes[auth.userRole].some((route) => to.path.startsWith(route))
  ) {
    return navigateTo(allowedRoutes[auth.userRole][0]);
  }
});
