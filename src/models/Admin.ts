import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

export type AdminDocument = InferSchemaType<typeof adminSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Admin: Model<AdminDocument> =
  (mongoose.models.Admin as Model<AdminDocument> | undefined) ??
  mongoose.model<AdminDocument>("Admin", adminSchema, "admins");
