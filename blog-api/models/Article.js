const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    title: { type: String, required: true ,trim: true},
    content: { type: String, required: true ,trim: true},
    tags: {
      type: [String],
      default: []
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
