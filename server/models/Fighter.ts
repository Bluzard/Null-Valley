import mongoose, { Schema, model } from 'mongoose';

const fighterSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  photo:{
    type: String,
    required: true,
  },
}, {
  timestamps: true, 
});

const Fighter = mongoose.models.Fighter || model('Fighter', fighterSchema);

export default Fighter;
