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

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: "Sultani-arts" });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
