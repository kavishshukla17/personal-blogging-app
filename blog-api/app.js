const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require("dns");
const articleRoutes = require("./routes/articlesRoutes");
const authRoutes = require("./routes/authRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorhandler");
const { dbConnect } = require("./db");

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not set. Set it in .env for auth to work.");
}

if (!process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch {
    /* ignore */
  }
}

const app = express();

const corsStatic = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (process.env.CLIENT_ORIGIN && origin === process.env.CLIENT_ORIGIN) {
        return cb(null, true);
      }
      if (corsStatic.includes(origin)) return cb(null, true);
      try {
        const { hostname } = new URL(origin);
        if (hostname.endsWith(".vercel.app")) return cb(null, true);
      } catch {
        /* ignore */
      }
      cb(null, false);
    },
  })
);
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(503).json({
        message: "Database not configured. Set MONGO_URI in Vercel Project → Settings → Environment Variables.",
      });
    }
    await dbConnect();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
