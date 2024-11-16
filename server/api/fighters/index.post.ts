import { defineEventHandler, readBody } from 'h3';
import Fighter from '../../models/Fighter';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newFighter = await Fighter.create(body);
  return newFighter;
});
