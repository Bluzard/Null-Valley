<template>
    <v-card>
      <v-card-title class="text-h5">
        Historial de Votos
      </v-card-title>
      <v-divider></v-divider>
      <v-list>
        <template v-for="(fighterVotes, fighterId) in comments" :key="fighterId">
          <v-list-group
            :value="true"
            color="primary"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  {{ fighters.find(f => f._id === fighterId)?.name }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
  
            <v-list-item v-for="(vote, index) in fighterVotes" :key="index">
              <v-list-item-content>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>{{ vote.nickname }}</span>
                  <v-chip x-small :color="vote.rating > 0 ? 'success' : 'error'">
                    {{ vote.rating > 0 ? '+2' : '-1' }}
                  </v-chip>
                </v-list-item-title>
                <v-list-item-subtitle>{{ vote.comment }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-card>
  </template>
  
  <script setup>
  defineProps({
    comments: {
      type: Object,
      required: true
    },
    fighters: {
      type: Array,
      required: true
    }
  })
  </script>