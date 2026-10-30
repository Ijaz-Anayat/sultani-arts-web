import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const pageViewSchema = new Schema(
  {
    path: { type: String, required: true, maxlength: 300 },
    visitorId: { type: String, required: true, maxlength: 36 },
    createdAt: { type: Date, default: Date.now, immutable: true },
  },
  { versionKey: false },
);

pageViewSchema.index({ createdAt: 1 });
pageViewSchema.index({ visitorId: 1, createdAt: 1 });

export type PageViewDocument = InferSchemaType<typeof pageViewSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const PageView: Model<PageViewDocument> =
  (mongoose.models.PageView as Model<PageViewDocument> | undefined) ??
  mongoose.model<PageViewDocument>("PageView", pageViewSchema, "pageviews");
