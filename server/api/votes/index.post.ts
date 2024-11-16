import { defineEventHandler, readBody } from 'h3';
import Vote from '../../models/Vote';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body); // Verifica los datos recibidos

  const newVote = new Vote({
    nickname: body.nickname,
    comment: body.comment,
    rating: body.rating,
    fighterId: body.fighter,
  });

  try {
    await newVote.save();
    return { success: true };
  } catch (error) {
    console.error(error); // Imprime el error si ocurre
    return { error: 'Failed to save vote' };
  }
});
