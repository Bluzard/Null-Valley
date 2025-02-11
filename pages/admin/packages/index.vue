# pages/packages/index.vue
<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Encomiendas</h1>
      <v-btn color="deep-purple" prepend-icon="mdi-plus" @click="dialog = true">
        Nueva Encomienda
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
              label="Buscar por residente"
              hide-details
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="statusFilter"
              :items="statusTypes"
              label="Estado"
              item-title="title"
              item-value="value"
              hide-details
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabla de encomiendas -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredPackages"
        :search="search"
        :loading="loading"
      >
        <!-- Columna de residente -->
        <template v-slot:item.recipient="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" class="mr-2">
              <v-img
                :src="`https://api.dicebear.com/7.x/initials/svg?seed=${item.recipient.name}`"
              />
            </v-avatar>
            <div>
              <div>{{ item.recipient.name }}</div>
              <div class="text-caption text-grey">
                {{ item.recipient.apartment }}
              </div>
            </div>
          </div>
        </template>

        <!-- Columna de números de paquetes -->
        <template v-slot:item.packageCount="{ item }">
          <v-chip color="deep-purple" size="small">
            {{ item.packageCount }} paquetes
          </v-chip>
        </template>

        <!-- Columna de estado -->
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small">
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <!-- Columna de fechas -->
        <template v-slot:item.receivedAt="{ item }">
          {{ formatDate(item.receivedAt) }}
        </template>

        <!-- Columna de acciones -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-check"
            variant="text"
            size="small"
            color="success"
            class="mr-1"
            @click="markAsDelivered(item)"
            v-if="item.status === 'received'"
          />
          <v-btn
            icon="mdi-delete"
            variant="text"
            size="small"
            color="error"
            @click="confirmDelete(item)"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5"> Confirmar eliminación </v-card-title>
        <v-card-text>
          ¿Estás seguro que deseas eliminar esta encomienda? Esta acción no se
          puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn color="error" variant="text" @click="deletePackage">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Estados
const search = ref("");
const statusFilter = ref(null);
const loading = ref(true);
const deleteDialog = ref(false);
const selectedPackage = ref(null);

// Datos para selects
const statusTypes = [
  { title: "Por entregar", value: "received" },
  { title: "Entregado", value: "delivered" },
];

// Configuración de la tabla
const headers = [
  { title: "Residente", key: "recipient", align: "start" },
  { title: "Cantidad", key: "packageCount", align: "start" },
  { title: "Fecha Recepción", key: "receivedAt", align: "start" },
  { title: "Estado", key: "status", align: "start" },
  { title: "Acciones", key: "actions", align: "end", sortable: false },
];

// Datos de ejemplo
const packages = ref([
  {
    recipient: { name: "Juan Pérez", apartment: "510A" },
    packageCount: 2,
    receivedAt: new Date("2024-02-09T10:30:00"),
    status: "received",
  },
  {
    recipient: { name: "María González", apartment: "202B" },
    packageCount: 1,
    receivedAt: new Date("2024-02-08T15:45:00"),
    status: "delivered",
  },
]);

// Paquetes filtrados
const filteredPackages = computed(() => {
  return packages.value.filter((pkg) => {
    if (statusFilter.value && pkg.status !== statusFilter.value) {
      return false;
    }
    return true;
  });
});

// Métodos de utilidad
const getStatusColor = (status) => {
  const colors = {
    received: "warning",
    delivered: "success",
  };
  return colors[status];
};

const getStatusText = (status) => {
  const texts = {
    received: "Por entregar",
    delivered: "Entregado",
  };
  return texts[status];
};

const formatDate = (date) => {
  if (!date) return "---";
  return new Date(date).toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Métodos de acción
const markAsDelivered = (pkg) => {
  // Implementar lógica para marcar como entregado
  console.log("Marcar como entregado:", pkg);
};

const confirmDelete = (pkg) => {
  selectedPackage.value = pkg;
  deleteDialog.value = true;
};

const deletePackage = () => {
  // Implementar lógica de eliminación
  console.log("Eliminar paquete:", selectedPackage.value);
  deleteDialog.value = false;
  selectedPackage.value = null;
};

// Simular carga inicial
setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
