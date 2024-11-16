import { defineEventHandler } from 'h3';
import Votes from '../../models/Vote';

export default defineEventHandler(async () => {
  try {
    //borrar todos los votos
    await Votes.deleteMany({})
    return { success: true }
  } catch (error) {
    return { error: 'Failed to fetch votes' }
  }
});
