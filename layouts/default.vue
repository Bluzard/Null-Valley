# layouts/default.vue
<template>
  <v-app>
    <v-navigation-drawer
      color="deep-purple-darken-1"
      theme="dark"
      permanent
      width="260"
    >
      <div class="d-flex flex-column fill-height">
        <!-- Lista de navegación -->
        <v-list nav class="px-2 flex-grow-1">
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.to"
            active-color="deep-purple-lighten-1"
            color="white"
            class="mb-1"
          >
            <template v-slot:append v-if="item.hasBadge">
              <v-badge color="error" dot v-if="hasNotifications" />
            </template>
          </v-list-item>
        </v-list>

        <!-- Perfil al final -->
        <div class="profile-section">
          <v-divider></v-divider>
          <v-list class="px-2">
            <v-list-item
              prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
              :title="userName"
              subtitle="Administrador"
              class="profile-item"
            />
          </v-list>
        </div>
      </div>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const hasNotifications = ref(true);
const userName = ref("John Doe");

const menuItems = [
  { title: "Dashboard", icon: "mdi-view-dashboard", to: "/" },
  { title: "Residentes", icon: "mdi-account-group", to: "/residents" },
  { title: "Visitas", icon: "mdi-account-arrow-right", to: "/visits" },
  { title: "Encomiendas", icon: "mdi-package-variant-closed", to: "/packages" },
  { title: "Gastos Comunes", icon: "mdi-currency-usd", to: "/expenses" },
  { title: "Instalaciones", icon: "mdi-calendar-clock", to: "/facilities" },
  {
    title: "Notificaciones",
    icon: "mdi-bell",
    to: "/notifications",
    hasBadge: true,
  },
];
</script>

<style scoped>
.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.v-list-item {
  min-height: 44px !important;
  border-radius: 8px;
}

.profile-section {
  margin-top: auto;
}

.profile-item {
  min-height: 56px !important;
  border-radius: 8px;
  margin: 8px 0;
}

:deep(.v-list-item__prepend) {
  padding-inline-start: 8px;
}

:deep(.v-list-item__content) {
  font-weight: 500;
}

:deep(.v-list-item__subtitle) {
  opacity: 0.7;
  font-size: 0.8rem;
}
</style>
