<template>
  <v-card class="mb-6">
    <v-card-title class="text-h5 text-center">
      Registra tu voto
    </v-card-title>
    
    <v-card-text>
      <v-form ref="form" @submit.prevent="submitVote" v-model="valid">
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="nickname"
                label="Nickname (6-8 caracteres alfanuméricos)"
                :rules="nicknameRules"
                required
                variant="outlined"
                clearable
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedFighter"
                :items="fighters"
                item-title="name"
                item-value="_id"
                label="Selecciona un luchador"
                :rules="[v => !!v || 'Debes seleccionar un luchador']"
                required
                variant="outlined"
              />
            </v-col>
            
            <v-col cols="12">
              <v-textarea
                v-model="comment"
                label="Comentario (máximo 120 caracteres)"
                :rules="commentRules"
                counter="120"
                required
                variant="outlined"
                rows="3"
              />
            </v-col>
            
            <v-col cols="12">
              <v-card variant="outlined" class="pa-4">
                <v-card-title class="text-subtitle-1">Valoración</v-card-title>
                <v-radio-group 
                  v-model="rating" 
                  :rules="[v => !!v || 'Debes seleccionar una valoración']"
                  inline
                >
                  <v-radio 
                    label="Positiva (+2)" 
                    :value="2"
                    color="success"
                  />
                  <v-radio 
                    label="Negativa (-1)" 
                    :value="-1"
                    color="error"
                  />
                </v-radio-group>
              </v-card>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn
                type="submit"
                color="primary"
                size="large"
                :disabled="!valid"
                :loading="loading"
              >
                Enviar voto
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
const emit = defineEmits(['vote-submitted'])
const props = defineProps({
  fighters: {
    type: Array,
    required: true
  }
})

const form = ref(null)
const valid = ref(false)
const loading = ref(false)
const nickname = ref('')
const comment = ref('')
const selectedFighter = ref(null)
const rating = ref(null)

const nicknameRules = [
  v => !!v || 'Nickname es requerido',
  v => (v && v.length >= 6) || 'Mínimo 6 caracteres',
  v => (v && v.length <= 8) || 'Máximo 8 caracteres',
  v => /^[a-zA-Z0-9]+$/.test(v) || 'Solo caracteres alfanuméricos'
]

const commentRules = [
  v => !!v || 'Comentario es requerido',
  v => (v && v.length <= 120) || 'Máximo 120 caracteres'
]

const submitVote = async () => {
  const { valid } = await form.value.validate()
  
  if (valid) {
    loading.value = true
    try {
      await emit('vote-submitted', {
        nickname: nickname.value,
        comment: comment.value,
        fighterId: selectedFighter.value,
        rating: rating.value
      })
      
      form.value.reset()
      // Mostrar mensaje de éxito
    } catch (error) {
      // Manejar error
    } finally {
      loading.value = false
    }
  }
}
</script>