import { defineStore } from "pinia";

interface UserData {
  role: string;
  token: string;
}

// stores/auth.ts
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as { role: string } | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role,
  },

  actions: {
    setUser(userData: UserData) {
      this.user = userData;
      this.token = userData.token;
      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(userData));
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      navigateTo("/login");
    },

    // Recuperar sesión al recargar
    initAuth() {
      const userData = localStorage.getItem("user");
      if (userData) {
        this.setUser(JSON.parse(userData));
      }
    },
  },
});
