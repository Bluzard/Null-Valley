<template>
  <v-card v-if="winner || isTie" class="text-center pa-4">
    <!-- Caso de Ganador -->
    <template v-if="winner">
      <v-card-title class="text-h4 mb-4">¡Tenemos un ganador!</v-card-title>
      
      <v-sheet class="mx-auto" max-width="600">
        <v-img
          :src="winner.photo"
          :alt="winner.name"
          height="400"
          width="400"
          class="mx-auto rounded-lg"
          cover
          :error="defaultImage"
        >
          <!-- Loading placeholder -->
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary"/>
            </v-row>
          </template>
          
          <!-- Overlay con información del ganador -->
          <template v-slot:default>
            <v-overlay
              class="align-end text-white"
              contained
              scrim="rgba(0, 0, 0, 0.3)"
            >
              <v-card-title class="text-h5">{{ winner.name }}</v-card-title>
              <v-card-subtitle class="text-white">
                Puntuación final: {{ winnerScore }}
              </v-card-subtitle>
            </v-overlay>
          </template>
        </v-img>
      </v-sheet>
    </template>

    <!-- Caso de Empate -->
    <template v-else>
      <v-card-title class="text-h4">¡Empate!</v-card-title>
      <v-card-text>
        No se ha determinado un ganador claro. Esto puede deberse a:
        <ul class="mt-2 text-left">
          <li>Ningún participante tiene puntuación positiva</li>
          <li>Las puntuaciones están igualadas</li>
        </ul>
      </v-card-text>
    </template>

    <!-- Lista de opiniones (común para ambos casos) -->
    <v-expansion-panels class="mt-6">
  <v-expansion-panel>
    <v-expansion-panel-title>
      Ver todas las opiniones ({{ comments?.length || 0 }}/10)
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-list v-if="comments && comments.length > 0">
        <v-list-item
          v-for="(comment, index) in comments"
          :key="index"
          class="mb-2"
        >
          <template v-slot:default>
            <v-list-item-title class="text-caption">
              Usuario: {{ comment.nickname }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-body-1 mt-1">
              {{ obscureProhibitedWords(comment.text) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="text-caption mt-1">
              Valoración: {{ comment.rating > 0 ? '+' : '' }}{{ comment.rating }}
            </v-list-item-subtitle>
          </template>
        </v-list-item>
      </v-list>
      <div v-else class="text-center pa-4">
        No hay opiniones registradas
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</v-expansion-panels>
    
    <!-- Botón de reinicio -->
    <v-btn
      color="primary"
      @click="handleReset"
      class="mt-6"
      :loading="isResetting"
      :disabled="isResetting"
      size="large"
      block
    >
      {{ isResetting ? 'Reiniciando encuesta...' : 'Reiniciar encuesta' }}
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
  },
  comments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['reset'])

const isResetting = ref(false)
const defaultImage = '/images/default-fighter.jpg'

// Lista de palabras prohibidas
const prohibitedWords = [
  'manzana', 'coliflor', 'bombilla', 'derecha', 
  'izquierda', 'rojo', 'azul'
]

// Función para ofuscar palabras prohibidas
const obscureProhibitedWords = (text) => {
  if (!text) return ''
  
  let processedText = text.toLowerCase()
  prohibitedWords.forEach(word => {
    const regex = new RegExp(word, 'gi')
    processedText = processedText.replace(regex, '*'.repeat(word.length))
  })
  return processedText
}

// Manejador del reinicio
const handleReset = async () => {
  isResetting.value = true
  try {
    await emit('reset')
  } finally {
    isResetting.value = false
  }
}
</script>