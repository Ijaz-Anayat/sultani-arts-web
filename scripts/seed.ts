import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { resolve } from "node:path";
import mongoose from "mongoose";
import { slugify } from "../src/lib/utils";

config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const DB_NAME = "Sultani-arts";
const COLLECTIONS = [
  "categories",
  "admins",
  "products",
  "orders",
  "newslettersubscribers",
  "reviews",
] as const;

const SEED_CATEGORIES = ["Canvas", "Oil Painting", "Calligraphy"];

async function seed() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env.local");
  }
  if (MONGODB_URI.includes("<db_password>") || MONGODB_URI.includes("<password>")) {
    throw new Error(
      "Replace <db_password> in .env.local with the real Atlas password for teamsultaniarts_db_user.",
    );
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  }

  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("MongoDB connection is missing a database handle");
  }

  for (const name of COLLECTIONS) {
    const existing = await db.listCollections({ name }).toArray();
    if (existing.length === 0) {
      await db.createCollection(name);
      console.log(`Collection created: ${name}`);
    } else {
      console.log(`Collection exists: ${name}`);
    }
  }

  const { Category } = await import("../src/models/Category");
  const { Admin } = await import("../src/models/Admin");

  for (const name of SEED_CATEGORIES) {
    const slug = slugify(name);
    await Category.updateOne(
      { slug },
      { $setOnInsert: { name, slug, createdAt: new Date() } },
      { upsert: true },
    );
    console.log(`Category ready: ${name}`);
  }

  const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await Admin.create({
      email: ADMIN_EMAIL,
      password,
      role: "admin",
    });
    console.log(`Admin created: ${ADMIN_EMAIL}`);
  } else {
    console.log(`Admin already exists: ${ADMIN_EMAIL}`);
  }

  const names = (await db.listCollections().toArray()).map((item) => item.name);
  console.log(`Database: ${db.databaseName}`);
  console.log(`Collections: ${names.join(", ") || "(none)"}`);

  await mongoose.disconnect();
  console.log("Seed complete.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
