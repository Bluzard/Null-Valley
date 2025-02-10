// models/FacilityReservation.ts
import { Schema, model } from "mongoose";

const facilityReservationSchema = new Schema({
  facility: { type: Schema.Types.ObjectId, ref: "Facility", required: true },
  resident: { type: Schema.Types.ObjectId, ref: "Resident", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },
  totalPrice: Number,
});

export const FacilityReservation = model(
  "FacilityReservation",
  facilityReservationSchema
);
