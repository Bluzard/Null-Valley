<template>
    <v-card class="h-100">
      <v-img
        :src="fighter.photo"
        :alt="fighter.name"
        height="300"
        contain
        class="bg-grey-lighten-2"
      />
      <v-card-title class="text-h5 text-center">{{ fighter.name }}</v-card-title>
      <v-card-text>
        <div class="text-h6 text-center mb-4">Puntuación total: {{ totalScore }}</div>
        
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Comentarios ({{ comments.length }})</span>
          </v-card-title>
          <v-card-text class="comments-container">
            <comment-list :comments="comments" />
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
  
  <style scoped>
  .comments-container {
    max-height: 400px;
    overflow-y: auto;
  }
  
  /* Estilo para la barra de scroll */
  .comments-container::-webkit-scrollbar {
    width: 8px;
  }
  
  .comments-container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .comments-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  .comments-container::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  </style>