import { defineEventHandler, readBody } from 'h3';
import Vote from '../../models/Vote';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);

  //verificar nickname que no exista
  const vote = await Vote.findOne({
    nickname: body.nickname
  });

  if (vote) {
    return { error: 'You have already voted' };
  }  

  const newVote = new Vote({
    nickname: body.nickname,
    comment: body.comment,
    rating: body.rating,
    fighterId: body.fighterId,
  });

  try {
    await newVote.save();
    return { success: true };
  } catch (error) {
    console.error(error); // Imprime el error si ocurre
    return { error: 'Failed to save vote' };
  }
});
