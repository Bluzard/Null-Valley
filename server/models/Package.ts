// models/Package.ts
import { Schema, model } from "mongoose";

const packageSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: "Resident", required: true },
  deliveryCompany: String,
  trackingNumber: String,
  receivedAt: { type: Date, default: Date.now },
  deliveredToResident: { type: Date },
  status: {
    type: String,
    enum: ["received", "delivered", "returned"],
    default: "received",
  },
});

export const Package = model("Package", packageSchema);
