<template>
    <v-card>
      <v-card-title class="text-h5">
        Historial de Votos
      </v-card-title>
      <v-divider></v-divider>
      <v-list>
        <v-list-item v-for="(vote, index) in comments" :key="index">
            <v-list-item-content>
                <v-list-item-title class="d-flex justify-space-between">
                <span>{{ vote.nickname }}</span>
                <v-chip x-small :color="vote.rating > 0 ? 'success' : 'error'">
                    {{ vote.rating > 0 ? `+${vote.rating}` : vote.rating }}
                </v-chip>
                </v-list-item-title>
                <v-list-item-subtitle>
                {{ vote.comment }}
                </v-list-item-subtitle>
            </v-list-item-content>
            </v-list-item>
      </v-list>
    </v-card>
  </template>
  <script setup>
  defineProps({
    comments: {
      type: Array, // Ahora se espera un array plano
      required: true
    }
  })
  </script>
  