import { defineEventHandler } from 'h3';
import Fighter from '../../models/Fighter';

export default defineEventHandler(async () => {
  try {
    const fighters = await Fighter.find()  // Obtener todos los luchadores
    return fighters
  } catch (error) {
    return { error: 'Failed to fetch fighters' }
  }
});
