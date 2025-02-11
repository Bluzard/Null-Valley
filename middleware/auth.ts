// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useState<{ role: keyof typeof roleRoutes }>("user");

  // Si no hay usuario, redirigir al login
  if (!user.value) {
    return navigateTo("/login");
  }

  // Rutas por rol
  const roleRoutes = {
    admin: [
      "/admin",
      "/residents",
      "/expenses",
      "/facilities",
      "/notifications",
    ],
    guard: ["/visits", "/packages"],
    resident: ["/my-account", "/my-expenses", "/my-packages", "/my-visits"],
    supervisor: ["/security", "/reports", "/cameras"],
  };

  // Verificar acceso según rol
  if (!roleRoutes[user.value.role]?.includes(to.path)) {
    return navigateTo("/unauthorized");
  }
});
