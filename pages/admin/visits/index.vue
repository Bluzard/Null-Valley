# pages/visits/index.vue
<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Visitas</h1>
      <v-btn color="deep-purple" prepend-icon="mdi-plus" @click="dialog = true">
        Nueva Visita
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
              label="Buscar por visitante"
              hide-details
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="apartmentSearch"
              prepend-inner-icon="mdi-home"
              label="Buscar por departamento"
              hide-details
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabla de visitas -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredVisits"
        :search="search"
        :loading="loading"
      >
        <!-- Columna de visitante -->
        <template v-slot:item.visitor="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" class="mr-2">
              <v-img
                :src="`https://api.dicebear.com/7.x/initials/svg?seed=${item.visitor.name}`"
              />
            </v-avatar>
            <div>
              <div>{{ item.visitor.name }}</div>
              <div class="text-caption text-grey">
                {{ item.visitor.identification }}
              </div>
            </div>
          </div>
        </template>

        <!-- Columna de fecha -->
        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Estados
const search = ref("");
const apartmentSearch = ref("");
const loading = ref(true);

// Configuración de la tabla
const headers = [
  { title: "Visitante", key: "visitor", align: "start" },
  { title: "Departamento", key: "apartment", align: "start" },
  { title: "Fecha de registro", key: "createdAt", align: "start" },
];

// Datos de ejemplo
const visits = ref([
  {
    visitor: {
      name: "Carlos López",
      identification: "12.345.678-9",
    },
    apartment: "510A",
    createdAt: new Date("2024-02-09T10:30:00"),
  },
  {
    visitor: {
      name: "Ana Silva",
      identification: "9.876.543-2",
    },
    apartment: "202B",
    createdAt: new Date("2024-02-09T14:00:00"),
  },
]);

// Visitas filtradas
const filteredVisits = computed(() => {
  return visits.value.filter((visit) => {
    if (
      apartmentSearch.value &&
      !visit.apartment
        .toLowerCase()
        .includes(apartmentSearch.value.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
});

// Método para formatear fecha
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
