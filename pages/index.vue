<template>
    <v-container class="py-6">
      <v-row class="mb-4">
        <v-col cols="12">
          <voting-progress :total-votes="totalVotes" />
        </v-col>
      </v-row>
  
      <winner-display
        v-if="winner"
        :winner="winner"
        :fighter-score="getFighterScore(winner._id)"
        :positive-votes="getPositiveVotes(winner._id)"
        :negative-votes="getNegativeVotes(winner._id)"
      />
  
      <v-row>
        <v-col cols="12" md="8">
          <fighter-list
            :fighters="fighters"
            :selected-fighter="selectedFighter"
            :comments="comments"
            @select-fighter="selectFighter"
          />
  
          <vote-form
            :selected-fighter="selectedFighter"
            :total-votes="totalVotes"
            @submit-vote="submitVote"
          />
        </v-col>
  
        <v-col cols="12" md="4">
          <vote-history
            :comments="comments"
            :fighters="fighters"
          />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import VotingProgress from './components/VotingProgress.vue'
  import WinnerDisplay from './components/WinnerDisplay.vue'
  import FighterList from './components/FighterList.vue'
  import VoteForm from './components/VoteForm.vue'
  import VoteHistory from './components/VoteHistory.vue'
  
  const fighters = ref([])
  const comments = ref({})
  const selectedFighter = ref(null)
  const winner = ref(null)
  
  const totalVotes = computed(() => {
    return Object.values(comments.value).reduce((total, fighterComments) => {
      return total + (fighterComments?.length || 0)
    }, 0)
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