import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const settingsSchema = new Schema({
  key: { type: String, required: true, unique: true, default: "store" },
  globalDiscountPercent: { type: Number, default: 0, min: 0, max: 100 },
  updatedAt: { type: Date, default: Date.now },
});

export type SettingsDocument = InferSchemaType<typeof settingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Settings: Model<SettingsDocument> =
  (mongoose.models.Settings as Model<SettingsDocument> | undefined) ??
  mongoose.model<SettingsDocument>("Settings", settingsSchema, "settings");
