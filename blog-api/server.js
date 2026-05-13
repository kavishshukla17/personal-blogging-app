const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
const articleRoutes = require("./routes/articlesRoutes");
const authRoutes = require("./routes/authRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorhandler");

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not set. Set it in .env for auth to work.");
}

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
      "http://localhost:5000",
      "http://127.0.0.1:5000",
    ],
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err.message));
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
