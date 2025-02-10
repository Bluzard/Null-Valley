// models/Notification.ts
import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ["general", "important", "emergency"],
    default: "general",
  },
  recipients: [{ type: Schema.Types.ObjectId, ref: "Resident" }],
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});

export const Notification = model("Notification", notificationSchema);
