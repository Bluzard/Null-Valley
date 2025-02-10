import { Schema, model } from "mongoose";

const residentSchema = new Schema({
  name: { type: String, required: true },
  apartment: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  isOwner: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Resident = model("Resident", residentSchema);
