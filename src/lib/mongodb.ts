import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongooseCache = cached;

function assertMongoUri(uri: string) {
  if (uri.includes("<db_password>") || uri.includes("<password>")) {
    throw new Error(
      "MONGODB_URI still has a placeholder password. Replace <db_password> in .env.local with your Atlas user password.",
    );
  }
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  assertMongoUri(MONGODB_URI);

  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return cached.conn;
  }

  cached.conn = null;
  if (mongoose.connection.readyState === 0) {
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: "Sultani-arts" });
  }

  const connectionPromise = cached.promise;
  try {
    cached.conn = await connectionPromise;
    return cached.conn;
  } catch (error) {
    if (cached.promise === connectionPromise) {
      cached.promise = null;
      cached.conn = null;
    }
    throw error;
  }
}
