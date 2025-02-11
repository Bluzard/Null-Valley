# pages/index.vue
<template>
  <div>
    <v-row class="mb-6">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 mb-2">Dashboard</h1>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn
          color="deep-purple"
          prepend-icon="mdi-plus"
          class="mr-2"
          @click="openVisitDialog"
        >
          Nueva Visita
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tarjetas de estadísticas -->
    <v-row>
      <v-col
        v-for="(stat, index) in statsCards"
        :key="index"
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card :loading="loading.stats" class="rounded-lg">
          <v-card-text>
            <div class="text-subtitle-1 mb-2">{{ stat.title }}</div>
            <div class="d-flex align-center">
              <div class="text-h4">{{ stat.value }}</div>
              <v-icon
                v-if="stat.icon"
                :color="stat.iconColor"
                class="ml-2"
                size="24"
              >
                {{ stat.icon }}
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Contenido Principal -->
    <v-row class="mt-6">
      <!-- Últimas Visitas -->
      <v-col cols="12" lg="8">
        <v-card :loading="loading.visits" class="rounded-lg">
          <v-card-title class="d-flex align-center px-4 py-3">
            <span class="text-h6">Últimas Visitas</span>
            <v-spacer />
            <v-btn
              variant="text"
              to="/visits"
              class="text-caption"
              color="deep-purple"
              :disabled="loading.visits"
            >
              Ver todas
            </v-btn>
          </v-card-title>
          <v-card-text class="px-0">
            <v-table>
              <thead>
                <tr>
                  <th class="pl-4">Visitante</th>
                  <th>Departamento</th>
                  <th>Fecha</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="visit in recentVisits" :key="visit._id">
                  <td class="pl-4">
                    <div class="d-flex align-center">
                      <v-avatar size="32" class="mr-2">
                        <v-img
                          :src="`https://api.dicebear.com/7.x/initials/svg?seed=${visit.visitor.name}`"
                        />
                      </v-avatar>
                      <div>
                        <div class="font-weight-medium">
                          {{ visit.visitor.name }}
                        </div>
                        <div class="text-caption text-grey">
                          {{ visit.visitor.identification }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{{ visit.resident.apartment }}</td>
                  <td>{{ formatDate(visit.entryTime) }}</td>
                  <td class="text-center">
                    <v-btn
                      icon="mdi-information"
                      variant="text"
                      size="small"
                      color="deep-purple"
                      @click="showVisitDetails(visit)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Panel Lateral -->
      <v-col cols="12" lg="4">
        <!-- Encomiendas Pendientes -->
        <v-card :loading="loading.packages" class="mb-6 rounded-lg">
          <v-card-title class="d-flex align-center px-4 py-3">
            <span class="text-h6">Encomiendas por Entregar</span>
            <v-spacer />
            <v-btn
              variant="text"
              to="/packages"
              class="text-caption"
              color="deep-purple"
              :disabled="loading.packages"
            >
              Ver todas
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="pkg in pendingPackages"
                :key="pkg._id"
                :subtitle="`Depto ${pkg.recipient.apartment}`"
              >
                <template #prepend>
                  <v-avatar color="deep-purple-lighten-4" class="mr-3">
                    <v-icon color="deep-purple">mdi-package-variant</v-icon>
                  </v-avatar>
                </template>
                <template #title>
                  <div class="font-weight-medium">{{ pkg.recipient.name }}</div>
                </template>
                <template #append>
                  <div class="text-caption text-grey">
                    {{ formatDate(pkg.receivedAt) }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Instalaciones Reservadas Hoy -->
        <v-card class="rounded-lg">
          <v-card-title class="d-flex align-center px-4 py-3">
            <span class="text-h6">Instalaciones Reservadas Hoy</span>
            <v-spacer />
            <v-btn
              variant="text"
              to="/facilities"
              class="text-caption"
              color="deep-purple"
            >
              Ver todas
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(reservation, index) in todayReservations"
                :key="index"
                :subtitle="
                  formatTimeRange(reservation.startTime, reservation.endTime)
                "
              >
                <template #prepend>
                  <v-avatar color="deep-purple-lighten-4" class="mr-3">
                    <v-icon color="deep-purple">{{ reservation.icon }}</v-icon>
                  </v-avatar>
                </template>
                <template #title>
                  <div class="font-weight-medium">
                    {{ reservation.facility }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogos -->
    <v-dialog v-model="dialogVisitDetails" max-width="500">
      <v-card>
        <v-card-title class="text-h6 px-4 py-3">
          Detalles de la Visita
        </v-card-title>
        <v-card-text v-if="selectedVisit">
          <v-list>
            <v-list-item>
              <template #prepend>
                <v-icon color="deep-purple">mdi-account</v-icon>
              </template>
              <v-list-item-title>Visitante</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedVisit.visitor.name
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="deep-purple">mdi-card-account-details</v-icon>
              </template>
              <v-list-item-title>Identificación</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedVisit.visitor.identification
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="deep-purple">mdi-home</v-icon>
              </template>
              <v-list-item-title>Departamento Visitado</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedVisit.resident.apartment
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="deep-purple">mdi-clock</v-icon>
              </template>
              <v-list-item-title>Fecha y Hora</v-list-item-title>
              <v-list-item-subtitle>{{
                formatDate(selectedVisit.entryTime)
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="deep-purple"
            variant="text"
            @click="dialogVisitDetails = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de nueva visita -->
    <v-dialog
      v-model="dialogVisit"
      max-width="600"
      @click:outside="closeVisitDialog"
    >
      <v-card>
        <v-card-title class="text-h6 px-4 py-3">
          Registrar Nueva Visita
        </v-card-title>
        <v-card-text>
          <v-form ref="visitForm" @submit.prevent="submitVisit">
            <v-text-field
              v-model="newVisit.visitor.name"
              label="Nombre del Visitante"
              variant="outlined"
              density="comfortable"
              class="mb-3"
              :rules="[(v) => !!v || 'El nombre es requerido']"
              required
            />
            <v-text-field
              v-model="newVisit.visitor.identification"
              label="Identificación"
              variant="outlined"
              density="comfortable"
              class="mb-3"
              :rules="[(v) => !!v || 'La identificación es requerida']"
              required
            />
            <v-text-field
              v-model="newVisit.visitor.phone"
              label="Teléfono"
              type="tel"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />
            <v-select
              v-model="newVisit.resident"
              :items="residents"
              item-title="name"
              item-value="_id"
              label="Residente a Visitar"
              variant="outlined"
              density="comfortable"
              class="mb-3"
              :rules="[(v) => !!v || 'Debe seleccionar un residente']"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="closeVisitDialog"
            :disabled="loading.submit"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="deep-purple"
            @click="submitVisit"
            :loading="loading.submit"
            :disabled="loading.submit"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Interfaces
interface Visitor {
  name: string;
  identification: string;
  phone: string;
}

interface Visit {
  _id: string;
  visitor: Visitor;
  resident: {
    _id: string;
    name: string;
    apartment: string;
  };
  entryTime: string;
}

interface Package {
  _id: string;
  recipient: {
    name: string;
    apartment: string;
  };
  receivedAt: string;
}

interface Resident {
  _id: string;
  name: string;
  apartment: string;
}

interface Reservation {
  facility: string;
  startTime: string;
  endTime: string;
  icon: string;
}

// Estados
const loading = ref({
  stats: false,
  visits: false,
  packages: false,
  residents: false,
  submit: false,
});

const stats = ref({
  visitsToday: 0,
  visitsYesterday: 0,
  pendingPackages: 0,
  pendingExpenses: 0,
  activeReservations: 0,
  activeNotifications: 0,
});

const recentVisits = ref<Visit[]>([]);
const pendingPackages = ref<Package[]>([]);
const residents = ref<Resident[]>([]);
const dialogVisit = ref(false);
const dialogVisitDetails = ref(false);
const selectedVisit = ref<Visit | null>(null);
const visitForm = ref<null | any>(null);

const newVisit = ref({
  visitor: {
    name: "",
    identification: "",
    phone: "",
  },
  resident: "",
});

// Datos para reservas de ejemplo
const todayReservations = ref<Reservation[]>([
  {
    facility: "Salón de Eventos",
    startTime: "2024-02-10T14:00:00",
    endTime: "2024-02-10T18:00:00",
    icon: "mdi-party-popper",
  },
  {
    facility: "Quincho",
    startTime: "2024-02-10T19:00:00",
    endTime: "2024-02-10T23:00:00",
    icon: "mdi-grill",
  },
]);

// Computed
const statsCards = computed(() => [
  {
    title: "Visitas Hoy",
    value: stats.value.visitsToday,
    icon: "mdi-account-multiple",
    iconColor: "deep-purple",
  },
  {
    title: "Encomiendas Pendientes",
    value: stats.value.pendingPackages,
    icon: "mdi-package-variant",
    iconColor: "deep-purple",
  },
  {
    title: "Reservas Activas",
    value: stats.value.activeReservations,
    icon: "mdi-calendar-check",
    iconColor: "deep-purple",
  },
  {
    title: "Notificaciones",
    value: stats.value.activeNotifications,
    icon: "mdi-bell",
    iconColor: "deep-purple",
  },
]);

// Métodos
const fetchDashboardData = async () => {
  loading.value.stats = true;
  loading.value.visits = true;
  loading.value.packages = true;
  loading.value.residents = true;

  try {
    // Aquí iría la lógica de fetch real
    setTimeout(() => {
      stats.value = {
        visitsToday: 8,
        visitsYesterday: 6,
        pendingPackages: 4,
        pendingExpenses: 2,
        activeReservations: 3,
        activeNotifications: 5,
      };

      recentVisits.value = [
        {
          _id: "1",
          visitor: {
            name: "Juan Pérez",
            identification: "12.345.678-9",
            phone: "+56912345678",
          },
          resident: {
            _id: "1",
            name: "María González",
            apartment: "501A",
          },
          entryTime: new Date().toISOString(),
        },
        // Agregar más visitas de ejemplo
      ];

      residents.value = [
        {
          _id: "1",
          name: "María González",
          apartment: "501A",
        },
        // Agregar más residentes de ejemplo
      ];
    }, 1000);
  } catch (error) {
    console.error("Error al cargar datos del dashboard:", error);
  } finally {
    loading.value.stats = false;
    loading.value.visits = false;
    loading.value.packages = false;
    loading.value.residents = false;
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTimeRange = (start: string, end: string) => {
  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  return `${formatTime(start)} - ${formatTime(end)}`;
};

const showVisitDetails = (visit: Visit) => {
  selectedVisit.value = visit;
  dialogVisitDetails.value = true;
};

const openVisitDialog = () => {
  dialogVisit.value = true;
};

const closeVisitDialog = () => {
  dialogVisit.value = false;
  if (visitForm.value) {
    visitForm.value.reset();
  }
  newVisit.value = {
    visitor: {
      name: "",
      identification: "",
      phone: "",
    },
    resident: "",
  };
};

const submitVisit = async () => {
  if (!visitForm.value) return;

  const { valid } = await visitForm.value.validate();
  if (!valid) return;

  loading.value.submit = true;
  try {
    // Aquí iría la lógica de envío real
    await new Promise((resolve) => setTimeout(resolve, 1000));
    closeVisitDialog();
    await fetchDashboardData();
  } catch (error) {
    console.error("Error al registrar visita:", error);
  } finally {
    loading.value.submit = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.v-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.v-list-item {
  transition: background-color 0.2s;
}

.v-list-item:hover {
  background-color: rgb(243, 243, 243);
}

.v-table {
  border-radius: 8px;
}

.text-h6 {
  font-weight: 600;
}
</style>
