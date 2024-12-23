import { defineEventHandler } from 'h3';
import Votes from '../../models/Vote';

export default defineEventHandler(async () => {
  try {
    const votes = await Votes.find().sort({_id:-1})  // Obtener todos los luchadores
    return votes
  } catch (error) {
    return { error: 'Failed to fetch votes' }
  }
});
