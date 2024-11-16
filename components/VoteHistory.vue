<template>
  <v-form ref="form" @submit.prevent="submitVote" v-model="valid">
    <v-card class="pa-4">
      <v-text-field
        v-model="nickname"
        label="Nickname"
        :rules="nicknameRules"
        required
      />
      
      <v-textarea
        v-model="comment"
        label="Comentario"
        :rules="commentRules"
        counter="120"
        required
      />
      
      <v-radio-group v-model="selectedFighter" :rules="[v => !!v || 'Debes seleccionar un luchador']">
        <v-radio
          v-for="fighter in fighters"
          :key="fighter._id"
          :label="fighter.name"
          :value="fighter._id"
        />
      </v-radio-group>
      
      <v-radio-group v-model="rating" :rules="[v => !!v || 'Debes seleccionar una valoración']">
        <v-radio label="Positiva (+2)" :value="2" />
        <v-radio label="Negativa (-1)" :value="-1" />
      </v-radio-group>
      
      <v-btn
        type="submit"
        color="primary"
        block
        :disabled="!valid"
      >
        Votar
      </v-btn>
    </v-card>
  </v-form>
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
    emit('vote-submitted', {
      nickname: nickname.value,
      comment: comment.value,
      fighterId: selectedFighter.value,
      rating: rating.value
    })
    
    form.value.reset()
  }
}
</script>