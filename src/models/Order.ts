import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const orderSchema = new Schema({
  customer: {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
  },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      title: String,
      image: String,
      size: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export type OrderDocument = InferSchemaType<typeof orderSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Order: Model<OrderDocument> =
  (mongoose.models.Order as Model<OrderDocument> | undefined) ??
  mongoose.model<OrderDocument>("Order", orderSchema);
