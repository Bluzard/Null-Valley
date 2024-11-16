import { defineEventHandler } from 'h3';
import Votes from '../../models/Vote';

export default defineEventHandler(async () => {
  const vote = await Votes.find().sort({ _id: -1 });
  return vote;
});
