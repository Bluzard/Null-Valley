<template>
    <v-list class="pa-0">
      <v-list-item v-for="comment in comments" :key="comment._id" class="mb-2 px-0">
        <v-card width="100%" variant="outlined">
          <v-card-text>
            <div class="d-flex flex-wrap justify-space-between align-center gap-2">
              <span class="font-weight-bold">{{ comment.nickname }}</span>
              <v-chip
                :color="comment.rating === 2 ? 'success' : 'error'"
                size="small"
              >
                {{ comment.rating === 2 ? '+2' : '-1' }}
              </v-chip>
            </div>
            <div class="mt-2 text-wrap">{{ ofuscateText(comment.comment) }}</div>
          </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>
  </template>
  
  <script setup>
  const props = defineProps({
    comments: {
      type: Array,
      default: () => []
    }
  })
  
  const forbiddenWords = [
    'manzana', 'coliflor', 'bombilla', 'derecha', 
    'izquierda', 'rojo', 'azul'
  ]
  
  const ofuscateText = (text) => {
    if (!text) return ''
    let result = text.toLowerCase()
    forbiddenWords.forEach(word => {
      const regex = new RegExp(word, 'gi')
      result = result.replace(regex, '*'.repeat(word.length))
    })
    return result
  }
  </script>