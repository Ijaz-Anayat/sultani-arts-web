import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { resolve } from "node:path";
import mongoose from "mongoose";
import { slugify } from "../src/lib/utils";

config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const SEED_CATEGORIES = ["Canvas", "Oil Painting", "Calligraphy"];

async function seed() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env.local");
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  }

  await mongoose.connect(MONGODB_URI);

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

  await mongoose.disconnect();
  console.log("Seed complete.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
