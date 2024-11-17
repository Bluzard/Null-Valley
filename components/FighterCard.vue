<template>
  <v-card class="h-100 fighter-card">
    <div class="image-container">
      <v-img
        :src="fighter.photo"
        :alt="fighter.name"
        height="300"
        contain
        class="fighter-image"
        :class="{ 'pulse-effect': totalScore > 0 }"
      >
        <!-- Overlay con gradiente -->
        <template v-slot:default>
          <v-overlay
            class="align-end"
            contained
            scrim="rgba(0, 0, 0, 0.3)"
            scroll-strategy="none"
          >
            <div class="image-overlay pa-4">
              <div class="text-h5 font-weight-bold text-white mb-2">
                {{ fighter.name }}
              </div>
              <div 
                class="text-subtitle-1 text-white"
                :class="{'text-success': totalScore > 0, 'text-error': totalScore < 0}"
              >
                Puntuación: {{ totalScore > 0 ? '+' : ''}}{{ totalScore }}
              </div>
            </div>
          </v-overlay>
        </template>

        <!-- Loading placeholder -->
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="primary"/>
          </v-row>
        </template>
      </v-img>
    </div>

    <v-card-text>
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
.fighter-card {
  transition: transform 0.3s ease;
}

.fighter-card:hover {
  transform: translateY(-5px);
}

.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.fighter-image {
  transition: transform 0.3s ease;
}

.fighter-image:hover {
  transform: scale(1.05);
}

.image-overlay {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  width: 100%;
}

.pulse-effect {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
}

.comments-container {
  max-height: 400px;
  overflow-y: auto;
}

.comments-container::-webkit-scrollbar {
  width: 8px;
}

.comments-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.comments-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.comments-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Animación para la puntuación */
.text-success {
  color: #4CAF50 !important;
  text-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
}

.text-error {
  color: #FF5252 !important;
  text-shadow: 0 0 10px rgba(255, 82, 82, 0.3);
}
</style>