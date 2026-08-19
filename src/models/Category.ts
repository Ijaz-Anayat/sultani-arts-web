import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  createdAt: { type: Date, default: Date.now },
});

export type CategoryDocument = InferSchemaType<typeof categorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Category: Model<CategoryDocument> =
  (mongoose.models.Category as Model<CategoryDocument> | undefined) ??
  mongoose.model<CategoryDocument>("Category", categorySchema);
