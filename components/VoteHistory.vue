<!-- components/VoteHistory.vue -->
<template>
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
                      {{ vote.rating > 0 ? '+' : '' }}{{ vote.rating }}
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ vote.comment }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list>
      </v-card>
    </v-col>
  </template>
  
  <script setup>
  const props = defineProps({
    fighters: Array,
    getFighterVotes: Function,
    getFighterScore: Function
  })
  </script>
  