<!-- components/VoteForm.vue -->
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
                    :rules="[v => !!v || 'Requerido', v => (v?.length >= 6 && v?.length <= 8) || 'Entre 6 y 8 caracteres', v => /^[a-zA-Z0-9]+$/.test(v) || 'Solo caracteres alfanuméricos']"
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
                    :rules="[v => !!v || 'Requerido', v => v?.length <= 120 || 'Máximo 120 caracteres']"
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
                  <v-btn type="submit" color="primary" x-large min-width="200" :disabled="!isFormValid">
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
  const props = defineProps({
    nickname: String,
    comment: String,
    rating: Number,
    selectedFighter: Object,
    totalVotes: Number,
    isFormValid: Boolean
  })
  
  const emit = defineEmits(['submitVote'])
  
  const submitVote = () => {
    emit('submitVote')
  }
  </script>
  