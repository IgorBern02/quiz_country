import { Schema, model, Document } from "mongoose";

export interface IScore extends Document {
  name: string;
  score: number;
}

const scoreSchema = new Schema<IScore>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

export const Score = model<IScore>("Score", scoreSchema);
