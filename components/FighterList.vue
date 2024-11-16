<!-- components/FighterList.vue -->
<template>
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
  </template>
  
  <script setup>
  const props = defineProps({
    fighters: Array,
    selectedFighter: Object,
    totalVotes: Number,
    getFighterScore: Function,
    getPositiveVotes: Function,
    getNegativeVotes: Function
  })
  
  const emit = defineEmits(['selectFighter'])
  
  const selectFighter = (fighter) => {
    emit('selectFighter', fighter)
  }
  </script>
  