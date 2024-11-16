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
  import { ref, onMounted } from 'vue';
  
  // Datos de respaldo de los peleadores
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
  ];
  
  const fighters = ref([]);
  const comments = ref([]);
  const selectedFighter = ref(null);
  const winner = ref(null);
  const totalVotes = ref(0); 
  
  // Función para calcular los votos totales
  const calculateTotalVotes = () => {
    totalVotes.value = comments.value.filter(vote => 
      vote.rating !== undefined && 
      vote.rating !== null && 
      (vote.rating > 0 || vote.rating < 0)
    ).length;
  };
  
  // Cargar los luchadores
  const loadFighters = async () => {
    try {
      const response = await fetch('/api/fighters');
      if (response.ok) {
        fighters.value = await response.json();
      } else {
        console.error('No se pudo conectar a la base de datos. Usando datos de respaldo.');
        fighters.value = fallbackFighters; // Si no hay conexión, usar datos de respaldo
      }
    } catch (error) {
      console.error('Error al cargar luchadores:', error);
      fighters.value = fallbackFighters; // Si la conexión falla, usar datos de respaldo
    }
  };
  
  // Cargar los comentarios
  const loadComments = async () => {
    try {
      const response = await fetch('/api/votes');
      if (response.ok) {
        const data = await response.json();
        comments.value = Array.isArray(data) ? data : data.comments || [];
        calculateTotalVotes(); 
        calculateWinner();
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      comments.value = [];
    }
  };
  
  // Función para calcular al ganador
  const calculateWinner = () => {
    if (totalVotes.value < 10) {
      winner.value = null;
      return;
    }
  
    if (!fighters.value.length) {
      winner.value = null;
      return;
    }
  
    const scores = {};
    let maxScore = -Infinity;
    let winningFighter = null;
  
    fighters.value.forEach(fighter => {
      const score = getFighterScore(fighter._id);
      scores[fighter._id] = score;
  
      if (score > maxScore) {
        maxScore = score;
        winningFighter = fighter;
      }
    });
  
    winner.value = maxScore > 0 ? winningFighter : null;
  };
  
  // Funciones auxiliares para obtener las puntuaciones de los luchadores
  const getFighterScore = (fighterId) => {
    if (!fighterId || !comments.value.length) return 0;
  
    return comments.value
      .filter(vote => vote.fighter === fighterId && vote.rating !== undefined)
      .reduce((total, vote) => total + (Number(vote.rating) || 0), 0);
  };
  
  // Seleccionar luchador
  const selectFighter = (fighter) => {
    selectedFighter.value = fighter;
  };
  
  // Enviar voto
  const submitVote = async ({ nickname, comment, rating }) => {
    if (!selectedFighter.value || rating === undefined || !nickname || !comment) {
      return;
    }
  
    const sanitizedComment = obfuscateComment(comment);
  
    const newVote = {
      nickname,
      comment: sanitizedComment,
      rating: Number(rating),
      fighter: selectedFighter.value._id,
    };
  
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVote),
      });
  
      if (response.ok) {
        await loadComments();
      }
    } catch (error) {
      console.error('Error al enviar voto:', error);
    }
  };
  
  // Cargar los datos cuando se monta el componente
  onMounted(() => {
    loadFighters();
    loadComments();
  });
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