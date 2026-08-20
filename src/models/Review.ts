import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const reviewSchema = new Schema({
  index: { type: Number, required: true, unique: true, min: 0 },
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 3, max: 5 },
  body: { type: String, required: true, trim: true },
  postedAt: { type: Date, required: true },
});

export type ReviewDocument = InferSchemaType<typeof reviewSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Review: Model<ReviewDocument> =
  (mongoose.models.Review as Model<ReviewDocument> | undefined) ??
  mongoose.model<ReviewDocument>("Review", reviewSchema, "reviews");
