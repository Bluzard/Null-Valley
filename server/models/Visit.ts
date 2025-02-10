// models/Visit.ts
import { Schema, model } from "mongoose";

const visitSchema = new Schema({
  visitor: {
    name: { type: String, required: true },
    identification: { type: String, required: true },
    phone: String,
  },
  resident: { type: Schema.Types.ObjectId, ref: "Resident", required: true },
  entryTime: { type: Date, required: true },
  exitTime: Date,
  purpose: String,
  status: {
    type: String,
    enum: ["scheduled", "in-progress", "completed"],
    default: "scheduled",
  },
});

export const Visit = model("Visit", visitSchema);
