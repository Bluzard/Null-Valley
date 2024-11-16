import mongoose, { Schema, model } from 'mongoose';

const voteSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 8,
    match: /^[a-zA-Z0-9]+$/
  },
  comment: {
    type: String,
    required: true,
    maxlength: 120
  },
  rating: {
    type: Number,
    required: true,
    enum: [-1, 2]
  },
  fighterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Fighter'
  }
}, {
  timestamps: true
});

const Vote = mongoose.models.Vote || model('Vote', voteSchema);

export default Vote;
