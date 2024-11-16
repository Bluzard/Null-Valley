<template>
  <v-card v-if="winner" class="text-center pa-4">
    <v-card-title class="text-h4">¡Tenemos un ganador!</v-card-title>
    <v-img
      :src="winner.photo"
      :alt="winner.name"
      height="300"
      cover
      class="my-4"
    />
    <v-card-title>{{ winner.name }}</v-card-title>
    <v-card-subtitle>Puntuación final: {{ winnerScore }}</v-card-subtitle>
    
    <v-btn
      color="primary"
      @click="$emit('reset')"
      class="mt-4"
    >
      Reiniciar encuesta
    </v-btn>
  </v-card>
  
  <v-card v-else-if="isTie" class="text-center pa-4">
    <v-card-title class="text-h4">¡Empate!</v-card-title>
    <v-btn
      color="primary"
      @click="$emit('reset')"
      class="mt-4"
    >
      Reiniciar encuesta
    </v-btn>
  </v-card>
</template>

<script setup>
const props = defineProps({
  winner: {
    type: Object,
    default: null
  },
  winnerScore: {
    type: Number,
    default: 0
  },
  isTie: {
    type: Boolean,
    default: false
  }
})

defineEmits(['reset'])
</script>