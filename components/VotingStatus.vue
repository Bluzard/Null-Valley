<!-- components/VotingStatus.vue -->
<template>
    <v-card color="info" class="pa-4">
      <div class="text-center">
        <div class="text-h5 white--text mb-2">Estado de la Votación</div>
        <v-progress-linear 
          :value="(totalVotes * 10)"
          height="25" 
          rounded 
          class="mb-2"
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
        <div class="text-body-1 white--text">
          {{ totalVotes }} de 10 votos emitidos
        </div>
      </div>
    </v-card>
  </template>
  
  <script setup>
  const props = defineProps({
    totalVotes: Number
  })
  </script>
  