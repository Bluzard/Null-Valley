# pages/residents/index.vue
<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Residentes</h1>
      <v-btn color="deep-purple" prepend-icon="mdi-plus" @click="dialog = true">
        Nuevo Residente
      </v-btn>
    </div>

    <!-- Filtros y búsqueda -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Buscar residente"
              hide-details
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              v-model="towerFilter"
              :items="towers"
              label="Torre/Sección"
              item-title="name"
              item-value="id"
              hide-details
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              v-model="ownerFilter"
              :items="ownerTypes"
              label="Tipo de residente"
              hide-details
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabla de residentes -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredResidents"
        :search="search"
        :loading="loading"
      >
        <!-- Columna de avatar y nombre -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" class="mr-2">
              <v-img
                :src="`https://api.dicebear.com/7.x/initials/svg?seed=${item.name}`"
              />
            </v-avatar>
            {{ item.name }}
          </div>
        </template>

        <!-- Columna de apartamento -->
        <template v-slot:item.apartment="{ item }">
          <div class="d-flex align-center">
            {{ item.apartment }}
            <v-chip
              v-if="item.tower"
              size="x-small"
              class="ml-2"
              color="deep-purple"
              variant="flat"
            >
              Torre {{ item.tower }}
            </v-chip>
          </div>
        </template>

        <!-- Columna de tipo -->
        <template v-slot:item.isOwner="{ item }">
          <v-chip :color="item.isOwner ? 'success' : 'info'" size="small">
            {{ item.isOwner ? "Propietario" : "Arrendatario" }}
          </v-chip>
        </template>

        <!-- Columna de acciones -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            size="small"
            color="primary"
            @click="editResident(item)"
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
          ¿Estás seguro que deseas eliminar a este residente? Esta acción no se
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
          <v-btn color="error" variant="text" @click="deleteResident">
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
const ownerFilter = ref(null);
const towerFilter = ref(null);
const loading = ref(true);
const deleteDialog = ref(false);
const selectedResident = ref(null);

// Datos para selects
const ownerTypes = [
  { title: "Propietarios", value: "owner" },
  { title: "Arrendatarios", value: "tenant" },
];

const towers = [
  { id: "A", name: "Torre A" },
  { id: "B", name: "Torre B" },
  { id: "C", name: "Torre C" },
];

// Configuración de la tabla
const headers = [
  { title: "Nombre", key: "name", align: "start" },
  { title: "Unidad", key: "apartment", align: "start" },
  { title: "Email", key: "email", align: "start" },
  { title: "Teléfono", key: "phone", align: "start" },
  { title: "Tipo", key: "isOwner", align: "start" },
  { title: "Acciones", key: "actions", align: "end", sortable: false },
];

// Datos de ejemplo
const residents = ref([
  {
    name: "Juan Pérez",
    apartment: "510",
    tower: "A",
    email: "juan@email.com",
    phone: "+56 9 1234 5678",
    isOwner: true,
  },
  {
    name: "María González",
    apartment: "202",
    tower: "B",
    email: "maria@email.com",
    phone: "+56 9 8765 4321",
    isOwner: false,
  },
  {
    name: "Pedro Soto",
    apartment: "303",
    tower: "C",
    email: "pedro@email.com",
    phone: "+56 9 2468 1357",
    isOwner: true,
  },
]);

// Residentes filtrados
const filteredResidents = computed(() => {
  return residents.value.filter((resident) => {
    // Filtro por torre
    if (towerFilter.value && resident.tower !== towerFilter.value) {
      return false;
    }

    // Filtro por tipo de residente
    if (ownerFilter.value) {
      if (ownerFilter.value === "owner" && !resident.isOwner) return false;
      if (ownerFilter.value === "tenant" && resident.isOwner) return false;
    }

    return true;
  });
});

// Métodos
const editResident = (resident) => {
  console.log("Editar residente:", resident);
};

const confirmDelete = (resident) => {
  selectedResident.value = resident;
  deleteDialog.value = true;
};

const deleteResident = () => {
  console.log("Eliminar residente:", selectedResident.value);
  deleteDialog.value = false;
  selectedResident.value = null;
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
