const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGO_URI;

let cached = global.__mongooseBlog;

/**
 * Reuses the connection across Vercel serverless invocations.
 */
async function dbConnect() {
  if (!MONGODB_URI) return null;
  if (!cached) {
    cached = global.__mongooseBlog = { conn: null, promise: null };
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((m) => {
        console.log("MongoDB connected");
        return m;
      });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

module.exports = { dbConnect };
