# pages/index.vue
<template>
  <div>
    <!-- Título y acciones rápidas -->
    <v-row class="mb-6">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 mb-2">Dashboard</h1>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn
          color="primary"
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
        <v-card :loading="loading.stats">
          <v-card-text>
            <div class="text-subtitle-1 mb-2">{{ stat.title }}</div>
            <div class="d-flex align-center">
              <div class="text-h4">{{ stat.value }}</div>
              <v-icon
                v-if="stat.showTrend"
                :color="stat.trendColor"
                class="ml-2"
              >
                {{ stat.trendIcon }}
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Visitas Recientes y Encomiendas -->
    <v-row class="mt-6">
      <v-col cols="12" lg="6">
        <v-card :loading="loading.visits">
          <v-card-title class="d-flex align-center">
            Visitas Recientes
            <v-spacer />
            <v-btn
              variant="text"
              to="/visits"
              class="text-caption"
              :disabled="loading.visits"
            >
              Ver todas
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list lines="two">
              <v-list-item
                v-for="visit in recentVisits"
                :key="visit._id"
                :title="visit.visitor.name"
                :subtitle="formatVisitSubtitle(visit)"
              >
                <template #prepend>
                  <v-avatar color="grey-lighten-1">
                    <v-icon>mdi-account</v-icon>
                  </v-avatar>
                </template>
                <template #append>
                  <v-chip :color="getStatusColor(visit.status)" size="small">
                    {{ visit.status }}
                  </v-chip>
                </template>
              </v-list-item>
              <v-list-item v-if="!recentVisits.length && !loading.visits">
                <template #subtitle>
                  <div class="text-center">No hay visitas recientes</div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="6">
        <v-card :loading="loading.packages">
          <v-card-title class="d-flex align-center">
            Encomiendas Pendientes
            <v-spacer />
            <v-btn
              variant="text"
              to="/packages"
              class="text-caption"
              :disabled="loading.packages"
            >
              Ver todas
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list lines="two">
              <v-list-item
                v-for="pkg in pendingPackages"
                :key="pkg._id"
                :title="pkg.deliveryCompany || 'Sin empresa'"
                :subtitle="formatPackageSubtitle(pkg)"
              >
                <template #prepend>
                  <v-avatar color="grey-lighten-1">
                    <v-icon>mdi-package-variant</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
              <v-list-item v-if="!pendingPackages.length && !loading.packages">
                <template #subtitle>
                  <div class="text-center">No hay encomiendas pendientes</div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para nueva visita -->
    <v-dialog
      v-model="dialogVisit"
      max-width="600px"
      @click:outside="closeVisitDialog"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Registrar Nueva Visita</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="visitForm" @submit.prevent="submitVisit">
            <v-text-field
              v-model="newVisit.visitor.name"
              label="Nombre del Visitante"
              :rules="[(v) => !!v || 'El nombre es requerido']"
              required
            />
            <v-text-field
              v-model="newVisit.visitor.identification"
              label="Identificación"
              :rules="[(v) => !!v || 'La identificación es requerida']"
              required
            />
            <v-text-field
              v-model="newVisit.visitor.phone"
              label="Teléfono"
              type="tel"
            />
            <v-select
              v-model="newVisit.resident"
              :items="residents"
              item-title="name"
              item-value="_id"
              label="Residente a Visitar"
              :rules="[(v) => !!v || 'Debe seleccionar un residente']"
              required
            />
            <v-text-field
              v-model="newVisit.purpose"
              label="Motivo de la Visita"
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
            color="primary"
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
  status: "scheduled" | "in-progress" | "completed";
  purpose?: string;
}

interface Package {
  _id: string;
  deliveryCompany: string;
  recipient: {
    name: string;
    apartment: string;
  };
  receivedAt: string;
  status: "received" | "delivered" | "returned";
}

interface Resident {
  _id: string;
  name: string;
  apartment: string;
}

// Estado
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
});

const recentVisits = ref<Visit[]>([]);
const pendingPackages = ref<Package[]>([]);
const residents = ref<Resident[]>([]);
const dialogVisit = ref(false);
const visitForm = ref<null | any>(null);

const newVisit = ref({
  visitor: {
    name: "",
    identification: "",
    phone: "",
  },
  resident: "",
  purpose: "",
  status: "in-progress" as const,
});

// Computed
const statsCards = computed(() => [
  {
    title: "Visitas Hoy",
    value: stats.value.visitsToday,
    showTrend: true,
    trendColor:
      stats.value.visitsToday > stats.value.visitsYesterday
        ? "success"
        : "error",
    trendIcon:
      stats.value.visitsToday > stats.value.visitsYesterday
        ? "mdi-arrow-up"
        : "mdi-arrow-down",
  },
  {
    title: "Encomiendas Pendientes",
    value: stats.value.pendingPackages,
    showTrend: false,
  },
  {
    title: "Gastos por Vencer",
    value: stats.value.pendingExpenses,
    showTrend: false,
  },
  {
    title: "Reservas Activas",
    value: stats.value.activeReservations,
    showTrend: false,
  },
]);

// Métodos
const fetchDashboardData = async () => {
  loading.value.stats = true;
  loading.value.visits = true;
  loading.value.packages = true;
  loading.value.residents = true;

  try {
    const [statsRes, visitsRes, packagesRes, residentsRes] = await Promise.all([
      useFetch("/api/dashboard/stats"),
      useFetch("/api/visits", {
        params: {
          limit: 5,
          sort: "-entryTime",
        },
      }),
      useFetch("/api/packages", {
        params: {
          status: "received",
          limit: 5,
          sort: "-receivedAt",
        },
      }),
      useFetch("/api/residents"),
    ]);

    stats.value = (statsRes.data.value as typeof stats.value) || stats.value;
    recentVisits.value = (visitsRes.data.value?.visits || []).map(
      (visit: any) => ({
        _id: visit._id,
        visitor: {
          name: visit.visitor.name,
          identification: visit.visitor.identification,
          phone: visit.visitor.phone,
        },
        resident: {
          _id: visit.resident._id,
          name: visit.resident.name,
          apartment: visit.resident.apartment,
        },
        entryTime: visit.entryTime,
        status: visit.status,
        purpose: visit.purpose,
      })
    ) as Visit[];
    pendingPackages.value = (packagesRes.data.value?.packages || []).map(
      (pkg: any) => ({
        _id: pkg._id,
        deliveryCompany: pkg.deliveryCompany,
        recipient: {
          name: pkg.recipient.name,
          apartment: pkg.recipient.apartment,
        },
        receivedAt: pkg.receivedAt,
        status: pkg.status,
      })
    ) as Package[];
    residents.value = (residentsRes.data.value?.residents || []) as Resident[];
  } catch (error) {
    console.error("Error al cargar datos del dashboard:", error);
  } finally {
    loading.value.stats = false;
    loading.value.visits = false;
    loading.value.packages = false;
    loading.value.residents = false;
  }
};

const formatVisitSubtitle = (visit: Visit) => {
  return `Para: ${visit.resident.name} - ${new Date(
    visit.entryTime
  ).toLocaleString()}`;
};

const formatPackageSubtitle = (pkg: Package) => {
  return `Para: ${pkg.recipient.name} - Recibido: ${new Date(
    pkg.receivedAt
  ).toLocaleString()}`;
};

const getStatusColor = (status: Visit["status"]) => {
  const colors = {
    completed: "success",
    "in-progress": "warning",
    scheduled: "info",
  };
  return colors[status];
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
    purpose: "",
    status: "in-progress",
  };
};

const submitVisit = async () => {
  if (!visitForm.value) return;

  const { valid } = await visitForm.value.validate();
  if (!valid) return;

  loading.value.submit = true;
  try {
    await useFetch("/api/visits", {
      method: "POST",
      body: newVisit.value,
    });

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
