import { defineEventHandler } from 'h3';
import Votes from '../../models/Vote';

export default defineEventHandler(async () => {
  try {
    const votes = await Votes.find()  // Obtener todos los luchadores
    return votes
  } catch (error) {
    return { error: 'Failed to fetch votes' }
  }
});
