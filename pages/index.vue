<template>
  <v-container fluid>
    <v-row v-if="!hasWinner && !isTie" justify="center">
      <v-col cols="12" lg="10" xl="8">
        <VoteForm
          :fighters="fighters"
          @vote-submitted="handleVote"
        />
      </v-col>
      
      <v-col 
        v-for="fighter in fighters" 
        :key="fighter._id"
        cols="12"
        sm="6"
        lg="5"
      >
        <FighterCard
          :fighter="fighter"
          :comments="getCommentsForFighter(fighter._id)"
          :total-score="getScoreForFighter(fighter._id)"
        />
      </v-col>
    </v-row>
    
    <v-row v-else justify="center">
      <v-col cols="12" md="8" lg="6">
        <WinnerDisplay
          :winner="winner"
          :winner-score="winnerScore"
          :is-tie="isTie"
          @reset="resetVoting"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

const fighters = ref([])
const votes = ref([])
const hasWinner = ref(false)
const isTie = ref(false)
const winner = ref(null)
const winnerScore = ref(0)

const fallbackFighters = [
  {
    "_id": "6737f5fd45785a8f93497570",
    "name": "David Larousse",
    "photo": "/images/david.jpg"
  },
  {
    "_id": "6737f5fd45785a8f93497571",
    "name": "Jonathan Lowrie",
    "photo": "/images/jonathan.jpg"
  }
]

// Cargar luchadores y votos al iniciar
onMounted(async () => {
  try {
    const response = await fetch('/api/fighters')
    fighters.value = await response.json()
  } catch (error) {
    console.error('Error loading fighters:', error)
    fighters.value = fallbackFighters
  }
  
  try {
    const response = await fetch('/api/votes')
    votes.value = await response.json()
    checkWinner()
  } catch (error) {
    console.error('Error loading votes:', error)
    votes.value = []
  }
})

const getCommentsForFighter = (fighterId) => {
  return votes.value.filter(vote => vote.fighterId === fighterId)
}

const getScoreForFighter = (fighterId) => {
  return votes.value
    .filter(vote => vote.fighterId === fighterId)
    .reduce((sum, vote) => sum + vote.rating, 0)
}

const checkWinner = () => {
  if (votes.value.length >= 10) {
    const scores = fighters.value.map(fighter => ({
      fighter,
      score: getScoreForFighter(fighter._id)
    }))
    
    const positiveScores = scores.filter(s => s.score > 0)
    
    if (positiveScores.length === 0) {
      isTie.value = true
      return
    }
    
    const maxScore = Math.max(...positiveScores.map(s => s.score))
    const winnersWithMaxScore = positiveScores.filter(s => s.score === maxScore)
    
    if (winnersWithMaxScore.length === 1) {
      winner.value = winnersWithMaxScore[0].fighter
      winnerScore.value = maxScore
      hasWinner.value = true
    } else {
      isTie.value = true
    }
  }
}

const handleVote = async (voteData) => {
  try {
    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(voteData)
    })
    
    const newVote = await response.json()
    votes.value.push(newVote)
    checkWinner()
  } catch (error) {
    console.error('Error submitting vote:', error)
  }
}

const resetVoting = async () => {
  votes.value = []
  hasWinner.value = false
  isTie.value = false
  winner.value = null
  winnerScore.value = 0
  
  try {
    await fetch('/api/votes', { method: 'DELETE' })
  } catch (error) {
    console.error('Error resetting votes:', error)
  }
}
</script>