# pages/facilities/index.vue
<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Instalaciones</h1>
      <v-btn color="deep-purple" prepend-icon="mdi-plus" @click="dialog = true">
        Nueva Instalación
      </v-btn>
    </div>

    <!-- Cards de instalaciones -->
    <v-row>
      <v-col
        v-for="facility in facilities"
        :key="facility._id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <v-img
            :src="`https://api.dicebear.com/7.x/shapes/svg?seed=${facility.name}`"
            height="150"
            cover
            class="bg-grey-lighten-2"
          />

          <v-card-title class="d-flex justify-space-between align-center">
            {{ facility.name }}
            <v-chip
              :color="facility.available ? 'success' : 'error'"
              size="small"
            >
              {{ facility.available ? "Disponible" : "No disponible" }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <p class="mb-2">{{ facility.description }}</p>
            <div class="d-flex align-center text-grey">
              <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
              Capacidad: {{ facility.capacity }} personas
            </div>
            <div class="d-flex align-center text-grey mt-1">
              <v-icon size="small" class="mr-1">mdi-currency-usd</v-icon>
              Precio: ${{ facility.pricePerHour }}/hora
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="deep-purple"
              variant="text"
              @click="editFacility(facility)"
            >
              Editar
            </v-btn>
            <v-btn
              color="deep-purple"
              variant="text"
              @click="openReservations(facility)"
            >
              Ver reservas
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(true);

// Datos de ejemplo
const facilities = ref([
  {
    _id: "1",
    name: "Salón de eventos",
    description: "Amplio salón para eventos sociales y reuniones",
    capacity: 50,
    pricePerHour: 25000,
    available: true,
  },
  {
    _id: "2",
    name: "Quincho",
    description: "Área de parrilla con mesas y sillas",
    capacity: 20,
    pricePerHour: 15000,
    available: true,
  },
  {
    _id: "3",
    name: "Sala de reuniones",
    description: "Sala equipada para reuniones de trabajo",
    capacity: 12,
    pricePerHour: 10000,
    available: false,
  },
  {
    _id: "4",
    name: "Cancha deportiva",
    description: "Cancha multiuso para actividades deportivas",
    capacity: 15,
    pricePerHour: 12000,
    available: true,
  },
]);

// Métodos
const editFacility = (facility) => {
  console.log("Editar instalación:", facility);
};

const openReservations = (facility) => {
  router.push(`/facilities/${facility._id}/reservations`);
};

// Simular carga inicial
setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-4px);
}

.v-card-title {
  word-break: break-word;
  font-size: 1.1rem;
}
</style>
