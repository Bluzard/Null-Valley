<template>
    <v-container class="py-6">
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card color="info" class="pa-4">
            <div class="text-center">
              <div class="text-h5 white--text mb-2">Estado de la Votación</div>
              <v-progress-linear 
                :value="(totalVotes * 10)"
                height="25" 
                rounded 
                class="mb-2"
              >
                <template v-slot:default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
              <div class="text-body-1 white--text">
                {{ totalVotes }} de 10 votos emitidos
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
  
      <v-slide-y-transition>
        <v-row v-if="winner" class="mb-8">
          <v-col cols="12">
            <v-card elevation="8" class="winner-card">
              <v-container>
                <v-row align="center">
                  <v-col cols="12" md="4" class="text-center">
                    <v-avatar size="200" class="mb-4">
                      <v-img :src="winner.photo" :alt="winner.name" cover class="fighter-image"/>
                    </v-avatar>
                    <div class="text-h3 primary--text font-weight-bold">
                      ¡GANADOR!
                    </div>
                  </v-col>
                  <v-col cols="12" md="8">
                    <div class="text-h2 mb-4">{{ winner.name }}</div>
                    <v-chip large color="success" class="mb-4">
                      Puntuación Final: {{ getFighterScore(winner._id) }}
                    </v-chip>
                    <div class="text-h6 mb-2">Resumen de votos:</div>
                    <div class="d-flex">
                      <v-chip class="mr-2" color="success">
                        Positivos: {{ getPositiveVotes(winner._id) }}
                      </v-chip>
                      <v-chip color="error">
                        Negativos: {{ getNegativeVotes(winner._id) }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-slide-y-transition>
  
      <v-row>
        <v-col cols="12" md="8">
          <div class="text-h6 mb-4">Selecciona un peleador para votar:</div>
          <v-row class="mb-8">
            <v-col v-for="fighter in fighters" :key="fighter._id" cols="12">
              <v-card 
                @click="selectFighter(fighter)" 
                :class="{'selected-fighter': selectedFighter?._id === fighter._id}" 
                elevation="3" 
                hover 
                class="fighter-card"
              >
                <v-card-title class="pa-6 d-flex align-center">
                  <v-avatar size="80" class="mr-4">
                    <v-img :src="fighter.photo" :alt="fighter.name" cover class="fighter-image"/>
                  </v-avatar>
                  <div class="fighter-info">
                    <div class="text-h4">{{ fighter.name }}</div>
                    <div class="d-flex mt-2">
                      <v-chip small color="primary" class="mr-2">
                        Puntuación: {{ getFighterScore(fighter._id) }}
                      </v-chip>
                      <v-chip small color="success" class="mr-2">
                        +{{ getPositiveVotes(fighter._id) }}
                      </v-chip>
                      <v-chip small color="error">
                        -{{ getNegativeVotes(fighter._id) }}
                      </v-chip>
                    </div>
                  </div>
                  <v-icon 
                    v-if="totalVotes < 10"
                    class="ml-auto"
                    color="primary"
                  >
                    mdi-hand-pointing-left
                  </v-icon>
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
  
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
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title class="text-h5">
              Historial de Votos
            </v-card-title>
            <v-divider></v-divider>
            <v-list>
              <template v-for="fighter in fighters" :key="fighter._id">
                <v-list-group
                  :value="true"
                  color="primary"
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title class="text-h6">
                        {{ fighter.name }}
                        <v-chip x-small class="ml-2" color="primary">
                          {{ getFighterScore(fighter._id) }} pts
                        </v-chip>
                      </v-list-item-title>
                    </v-list-item-content>
                  </template>
  
                  <v-list-item v-for="(vote, index) in getFighterVotes(fighter._id)" :key="index">
                    <v-list-item-content>
                      <v-list-item-title class="d-flex justify-space-between">
                        <span>{{ vote.nickname }}</span>
                        <v-chip x-small :color="vote.rating > 0 ? 'success' : 'error'">
                          {{ vote.rating > 0 ? '+2' : '-1' }}
                        </v-chip>
                      </v-list-item-title>
                      <v-list-item-subtitle class="comment-text">
                        {{ truncateComment(vote.comment) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-group>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  
  const fighters = ref([])
  const comments = ref({})
  const nickname = ref('')
  const comment = ref('')
  const rating = ref(null)
  const selectedFighter = ref(null)
  const winner = ref(null)
  
  const totalVotes = computed(() => {
    return Object.values(comments.value).reduce((total, fighterComments) => {
      return total + (fighterComments?.length || 0)
    }, 0)
  })
  
  const isFormValid = computed(() => {
    return nickname.value?.length >= 6 &&
           nickname.value?.length <= 8 &&
           /^[a-zA-Z0-9]+$/.test(nickname.value) &&
           comment.value?.length > 0 &&
           comment.value?.length <= 120 &&
           rating.value !== null &&
           selectedFighter.value !== null &&
           totalVotes.value < 10
  })
  
  const getFighterScore = (fighterId) => {
    return comments.value[fighterId]?.reduce((total, vote) => total + vote.rating, 0) || 0
  }
  
  const getPositiveVotes = (fighterId) => {
    return comments.value[fighterId]?.filter(vote => vote.rating > 0).length || 0
  }
  
  const getNegativeVotes = (fighterId) => {
    return comments.value[fighterId]?.filter(vote => vote.rating < 0).length || 0
  }
  
  const getFighterVotes = (fighterId) => {
    return comments.value[fighterId] || []
  }
  
  const truncateComment = (text) => {
    return text.length > 50 ? text.substring(0, 50) + '...' : text
  }
  
  const prohibitedWords = ['Manzana', 'coliflor', 'bombilla', 'derecha', 'izquierda', 'rojo', 'azul']
  
  const obfuscateComment = (text) => {
    let obfuscatedText = text
    prohibitedWords.forEach(word => {
      const regex = new RegExp(word, 'gi')
      obfuscatedText = obfuscatedText.replace(regex, '****')
    })
    return obfuscatedText
  }
  
  const loadFighters = async () => {
    try {
      const response = await fetch('/api/fighters')
      if (response.ok) {
        fighters.value = await response.json()
        loadComments()
      }
    } catch (error) {
      console.error('Error loading fighters:', error)
    }
  }
  
  const loadComments = async () => {
    try {
      const response = await fetch('/api/votes')
      if (response.ok) {
        const votes = await response.json()
        comments.value = {}
        votes.forEach(vote => {
          if (!comments.value[vote.fighter]) {
            comments.value[vote.fighter] = []
          }
          comments.value[vote.fighter].push({
            nickname: vote.nickname,
            comment: obfuscateComment(vote.comment),
            rating: vote.rating
          })
        })
        calculateWinner()
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  }
  
  const calculateWinner = () => {
    if (totalVotes.value < 10) {
      winner.value = null
      return
    }
  
    const scores = {}
    fighters.value.forEach(fighter => {
      scores[fighter._id] = getFighterScore(fighter._id)
    })
  
    const maxScore = Math.max(...Object.values(scores))
    const winningFighter = fighters.value.find(fighter => scores[fighter._id] === maxScore && maxScore > 0)
    winner.value = winningFighter || null
  }
  
  const selectFighter = (fighter) => {
    selectedFighter.value = fighter
  }
  
  const submitVote = async () => {
    if (!isFormValid.value) return
  
    const newVote = {
      nickname: nickname.value,
      comment: comment.value,
      rating: rating.value,
      fighter: selectedFighter.value._id
    }
  
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVote)
      })
  
      if (response.ok) {
        nickname.value = ''
        comment.value = ''
        rating.value = null
        await loadComments()
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
    }
  }
  
  onMounted(loadFighters)
  </script>
  
  <style scoped>
  .fighter-card {
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .fighter-card:hover {
    transform: translateY(-4px);
  }
  
  .fighter-image {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  
  .selected-fighter {
    border: 3px solid var(--v-primary-base);
  }
  
  .winner-card {
    background: linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.95)), 
                linear-gradient(135deg, var(--v-success-base), var(--v-success-darken2));
    border: 4px solid var(--v-success-base);
  }
  
  .v-list-group__items .v-list-item {
    padding-left: 32px;
  }
  
  .comment-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .fighter-info {
    flex-grow: 1;
  }
  
  @media (max-width: 600px) {
    .text-h2 {
      font-size: 2rem !important;
    }
    
    .text-h3 {
      font-size: 1.75rem !important;
    }
    
    .text-h4 {
      font-size: 1.5rem !important;
    }
    
    .text-h5 {
      font-size: 1.25rem !important;
    }
    
    .v-card-title {
      flex-direction: column;
      text-align: center;
    }
    
    .v-avatar {
      margin-right: 0 !important;
      margin-bottom: 1rem;
    }
    
    .v-btn.x-large {
      width: 100%;
    }
  }
  </style>