import { config } from "dotenv";
import { resolve } from "node:path";
import mongoose from "mongoose";
import { REVIEW_POOL } from "../src/lib/review-pool-data";

config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "Sultani-arts";

async function seedReviews() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env.local");
  }

  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  const { Review } = await import("../src/models/Review");

  const now = Date.now();
  const documents = REVIEW_POOL.map((review, index) => ({
    index,
    name: review.name,
    location: review.location,
    rating: review.rating,
    body: review.body,
    postedAt: new Date(now - review.daysAgo * 24 * 60 * 60 * 1000),
  }));

  await Review.deleteMany({});
  await Review.insertMany(documents);
  console.log(`Reviews seeded: ${documents.length}`);
  await mongoose.disconnect();
}

seedReviews().catch((error) => {
  console.error(error);
  process.exit(1);
});
