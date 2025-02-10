// models/Facility.ts
import { Schema, model } from "mongoose";

const facilitySchema = new Schema({
  name: { type: String, required: true },
  description: String,
  capacity: Number,
  pricePerHour: Number,
  available: { type: Boolean, default: true },
});

export const Facility = model("Facility", facilitySchema);
