import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const settingsSchema = new Schema({
  key: { type: String, required: true, unique: true, default: "store" },
  globalDiscountPercent: { type: Number, default: 0, min: 0, max: 100 },
  cashOnDeliveryFees: {
    type: [
      new Schema(
        {
          sizeLabel: { type: String, required: true, trim: true },
          amount: { type: Number, required: true, min: 0 },
        },
        { _id: false },
      ),
    ],
    default: [],
  },
  updatedAt: { type: Date, default: Date.now },
});

export type SettingsDocument = InferSchemaType<typeof settingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

const cachedSettingsModel = mongoose.models.Settings as Model<SettingsDocument> | undefined;
if (cachedSettingsModel && !cachedSettingsModel.schema.path("cashOnDeliveryFees")) {
  mongoose.deleteModel("Settings");
}

export const Settings: Model<SettingsDocument> =
  (mongoose.models.Settings as Model<SettingsDocument> | undefined) ??
  mongoose.model<SettingsDocument>("Settings", settingsSchema, "settings");
