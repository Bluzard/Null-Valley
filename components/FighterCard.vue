<template>
    <v-card class="mx-2 mb-4">
      <v-img
        :src="fighter.photo"
        :alt="fighter.name"
        height="300"
        cover
      />
      <v-card-title class="text-h5 text-center">{{ fighter.name }}</v-card-title>
      <v-card-text>
        <div class="text-h6 text-center mb-4">Puntuación total: {{ totalScore }}</div>
        
        <v-card variant="outlined" class="mb-4">
          <v-card-title>Comentarios ({{ comments.length }})</v-card-title>
          <v-card-text>
            <comment-list :comments="comments" />
            <v-divider class="my-4"></v-divider>
            <div v-if="comments.length === 0" class="text-center text-subtitle-1">
              Aún no hay comentarios
            </div>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  const props = defineProps({
    fighter: {
      type: Object,
      required: true
    },
    comments: {
      type: Array,
      default: () => []
    },
    totalScore: {
      type: Number,
      default: 0
    }
  })
  </script>