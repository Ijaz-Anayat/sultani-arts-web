import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const newsletterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export type NewsletterDocument = InferSchemaType<typeof newsletterSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const NewsletterSubscriber: Model<NewsletterDocument> =
  (mongoose.models.NewsletterSubscriber as Model<NewsletterDocument> | undefined) ??
  mongoose.model<NewsletterDocument>(
    "NewsletterSubscriber",
    newsletterSchema,
    "newslettersubscribers",
  );
