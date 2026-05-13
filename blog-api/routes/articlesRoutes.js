const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const validateArticle = require("../middleware/validateArticle");
const validateArticleUpdate = require("../middleware/validateArticleUpdate");
const { protect } = require("../middleware/auth");

router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.post("/", protect, validateArticle, createArticle);
router.put("/:id", protect, validateArticleUpdate, updateArticle);
router.delete("/:id", protect, deleteArticle);

module.exports = router;
