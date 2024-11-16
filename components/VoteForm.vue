<template>
    <v-slide-y-transition>
      <v-row v-if="selectedFighter && totalVotes < 10" class="mb-8">
        <v-col cols="12">
          <v-card class="pa-6" elevation="2">
            <v-form @submit.prevent="submitVote" class="vote-form">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="nickname" 
                    label="Apodo" 
                    :rules="nicknameRules" 
                    maxlength="8" 
                    required 
                    outlined 
                    dense 
                    counter
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea 
                    v-model="comment" 
                    label="Comentarios" 
                    :rules="commentRules" 
                    maxlength="120" 
                    required 
                    outlined 
                    auto-grow 
                    counter 
                    rows="3"
                  />
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-radio-group v-model="rating" label="Calificación" mandatory required row>
                    <v-radio label="Positivo (+2)" :value="2" color="success" class="mr-8"/>
                    <v-radio label="Negativo (-1)" :value="-1" color="error"/>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-btn 
                    type="submit" 
                    color="primary" 
                    x-large 
                    min-width="200" 
                    :disabled="!isFormValid"
                  >
                    Enviar Voto
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-slide-y-transition>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    selectedFighter: {
      type: Object,
      default: null
    },
    totalVotes: {
      type: Number,
      required: true
    }
  })
  
  const emit = defineEmits(['submit-vote'])
  
  const nickname = ref('')
  const comment = ref('')
  const rating = ref(null)
  
  const nicknameRules = [
    v => !!v || 'Requerido',
    v => (v?.length >= 6 && v?.length <= 8) || 'Entre 6 y 8 caracteres',
    v => /^[a-zA-Z0-9]+$/.test(v) || 'Solo caracteres alfanuméricos'
  ]
  
  const commentRules = [
    v => !!v || 'Requerido',
    v => v?.length <= 120 || 'Máximo 120 caracteres'
  ]
  
  const isFormValid = computed(() => {
    return nickname.value?.length >= 6 &&
           nickname.value?.length <= 8 &&
           /^[a-zA-Z0-9]+$/.test(nickname.value) &&
           comment.value?.length > 0 &&
           comment.value?.length <= 120 &&
           rating.value !== null &&
           props.selectedFighter !== null &&
           props.totalVotes < 10
  })
  
  const submitVote = () => {
    if (!isFormValid.value) return
    
    emit('submit-vote', {
      nickname: nickname.value,
      comment: comment.value,
      rating: rating.value
    })
    
    nickname.value = ''
    comment.value = ''
    rating.value = null
  }
  </script>