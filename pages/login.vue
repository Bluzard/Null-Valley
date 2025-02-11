<!-- pages/login.vue -->
<template>
  <div class="login-container">
    <v-card class="login-card mx-auto pa-6" max-width="400">
      <v-card-title class="text-h5 text-center mb-4">
        Iniciar Sesión
      </v-card-title>

      <v-form ref="form" v-model="isFormValid" @submit.prevent="handleLogin">
        <v-text-field
          v-model="form.email"
          label="Email"
          type="email"
          variant="outlined"
          :rules="[rules.required, rules.email]"
          :error-messages="errors.email"
          :loading="loading"
          density="comfortable"
          class="mb-4"
          prepend-inner-icon="mdi-email"
        />

        <v-text-field
          v-model="form.password"
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          :rules="[rules.required]"
          :error-messages="errors.password"
          :loading="loading"
          density="comfortable"
          class="mb-6"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
        />

        <v-btn
          type="submit"
          color="deep-purple"
          block
          size="large"
          :loading="loading"
          :disabled="!isFormValid || loading"
        >
          Ingresar
        </v-btn>
      </v-form>

      <!-- Alerta de error -->
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        closable
        class="mt-4"
        @click:close="errorMessage = ''"
      >
        {{ errorMessage }}
      </v-alert>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

// Estados
const form = ref({
  email: "",
  password: "",
});
const showPassword = ref(false);
const loading = ref(false);
const isFormValid = ref(false);
const errorMessage = ref("");
const errors = reactive({
  email: "",
  password: "",
});

// Referencia al formulario
const formRef = ref(null);

// Reglas de validación
const rules = {
  required: (v) => !!v || "Este campo es requerido",
  email: (v) => /.+@.+\..+/.test(v) || "Email debe ser válido",
};

// Método de login
const handleLogin = async () => {
  // Reset de errores
  errorMessage.value = "";
  errors.email = "";
  errors.password = "";

  // Validar formulario
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;

  try {
    // Llamada a la API
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: form.value,
    });

    // Guardar datos del usuario
    auth.setUser(response);

    // Redirigir según rol
    const roleRoutes = {
      admin: "/admin",
      concierge: "/concierge",
      resident: "/resident",
    };

    router.push(roleRoutes[response.role] || "/");
  } catch (error) {
    // Manejar diferentes tipos de errores
    if (error.response?.status === 401) {
      errorMessage.value = "Credenciales incorrectas";
    } else if (error.response?.data?.errors) {
      // Errores de validación específicos
      const serverErrors = error.response.data.errors;
      if (serverErrors.email) errors.email = serverErrors.email;
      if (serverErrors.password) errors.password = serverErrors.password;
    } else {
      errorMessage.value = "Error al iniciar sesión. Intente nuevamente.";
    }
  } finally {
    loading.value = false;
  }
};

// Middleware para redirigir si ya está autenticado
definePageMeta({
  middleware: (to) => {
    const auth = useAuthStore();
    if (auth.isAuthenticated) {
      const roleRoutes = {
        admin: "/admin",
        concierge: "/concierge",
        resident: "/resident",
      };
      return navigateTo(roleRoutes[auth.userRole] || "/");
    }
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: rgb(243, 243, 243);
}

.login-card {
  width: 100%;
  max-width: 400px;
}
</style>
