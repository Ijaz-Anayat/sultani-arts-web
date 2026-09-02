import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const frameSchema = new Schema({
  sizeLabel: { type: String, required: true, trim: true },
  color: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

frameSchema.index({ sizeLabel: 1, color: 1 }, { unique: true });

export type FrameDocument = InferSchemaType<typeof frameSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Frame: Model<FrameDocument> =
  (mongoose.models.Frame as Model<FrameDocument> | undefined) ??
  mongoose.model<FrameDocument>("Frame", frameSchema, "frames");
