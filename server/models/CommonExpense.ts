// models/CommonExpense.ts
import { Schema, model } from "mongoose";

const commonExpenseSchema = new Schema({
  month: { type: Date, required: true },
  apartment: { type: String, required: true },
  amount: { type: Number, required: true },
  details: [
    {
      concept: String,
      amount: Number,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "paid", "overdue"],
    default: "pending",
  },
  paidAt: Date,
});

export const CommonExpense = model("CommonExpense", commonExpenseSchema);
