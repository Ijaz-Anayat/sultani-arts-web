import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const sizeSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const productSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  images: {
    type: [{ type: String, required: true }],
    required: true,
    validate: {
      validator: (value: string[]) => Array.isArray(value) && value.length >= 1,
      message: "At least one image is required",
    },
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  sizes: {
    type: [sizeSchema],
    required: true,
    validate: {
      validator: (value: unknown[]) => Array.isArray(value) && value.length === 3,
      message: "Each product must have exactly 3 size options",
    },
  },
  inStock: { type: Boolean, default: true },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now },
});

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product: Model<ProductDocument> =
  (mongoose.models.Product as Model<ProductDocument> | undefined) ??
  mongoose.model<ProductDocument>("Product", productSchema, "products");
