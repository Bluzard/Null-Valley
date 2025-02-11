# pages/notifications/index.vue
<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Notificaciones</h1>
      <v-btn color="deep-purple" prepend-icon="mdi-plus" @click="dialog = true">
        Nueva Notificación
      </v-btn>
    </div>

    <!-- Filtros -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Buscar notificaciones"
              hide-details
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="typeFilter"
              :items="notificationTypes"
              label="Tipo"
              hide-details
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Lista de notificaciones -->
    <v-card>
      <v-list>
        <v-list-item
          v-for="notification in filteredNotifications"
          :key="notification._id"
          :value="notification"
          rounded="lg"
          class="mb-2"
        >
          <template v-slot:prepend>
            <v-avatar
              :color="getNotificationColor(notification.type)"
              size="42"
            >
              <v-icon
                :icon="getNotificationIcon(notification.type)"
                color="white"
              />
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold mb-1">
            {{ notification.title }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ notification.content }}
          </v-list-item-subtitle>

          <template v-slot:append>
            <div class="text-caption text-grey">
              {{ formatDate(notification.createdAt) }}
            </div>
          </template>

          <v-divider class="mt-2" />
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Estados
const search = ref("");
const typeFilter = ref(null);
const loading = ref(true);

// Datos para selects
const notificationTypes = [
  { title: "General", value: "general" },
  { title: "Importante", value: "important" },
  { title: "Emergencia", value: "emergency" },
];

// Datos de ejemplo
const notifications = ref([
  {
    _id: "1",
    title: "Mantención ascensores",
    content:
      "Se realizará mantención de ascensores el día sábado 15 de febrero de 8:00 a 12:00 hrs.",
    type: "general",
    createdAt: new Date("2024-02-09T10:30:00"),
  },
  {
    _id: "2",
    title: "Corte de agua programado",
    content:
      "El día martes 18 de febrero habrá corte de agua desde las 14:00 a 18:00 hrs.",
    type: "important",
    createdAt: new Date("2024-02-09T15:00:00"),
  },
  {
    _id: "3",
    title: "Emergencia: Fuga de gas",
    content:
      "Se detectó una fuga de gas en el 5to piso. Por favor evacuar el edificio inmediatamente.",
    type: "emergency",
    createdAt: new Date("2024-02-09T18:30:00"),
  },
]);

// Notificaciones filtradas
const filteredNotifications = computed(() => {
  return notifications.value.filter((notification) => {
    if (typeFilter.value && notification.type !== typeFilter.value) {
      return false;
    }
    if (search.value) {
      const searchLower = search.value.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.content.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
});

// Métodos de utilidad
const getNotificationColor = (type) => {
  const colors = {
    general: "grey",
    important: "deep-purple",
    emergency: "red",
  };
  return colors[type];
};

const getNotificationIcon = (type) => {
  const icons = {
    general: "mdi-bell",
    important: "mdi-alert",
    emergency: "mdi-alert-octagon",
  };
  return icons[type];
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Simular carga inicial
setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<style scoped>
.v-list-item {
  border-radius: 8px;
  margin: 8px;
  transition: background-color 0.2s;
}

.v-list-item:hover {
  background-color: rgb(243, 243, 243);
}
</style>
