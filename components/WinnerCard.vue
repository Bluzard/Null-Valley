<!-- components/WinnerCard.vue -->
<template>
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
  </template>
  
  <script setup>
  const props = defineProps({
    winner: Object,
    getFighterScore: Function,
    getPositiveVotes: Function,
    getNegativeVotes: Function
  })
  </script>
  