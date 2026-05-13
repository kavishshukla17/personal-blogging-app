const Article = require("../models/Article");

function canMutateArticle(article, userId) {
  if (!article.author) return false;
  return article.author.toString() === userId;
}

const getAllArticles = async (req, res) => {
  try {
    const { tags, publishedAt, page, limit } = req.query;
    const filter = {};

    if (tags) filter.tags = { $in: tags.split(",") };
    if (publishedAt) filter.publishedAt = { $gte: new Date(publishedAt) };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("author", "email"),
      Article.countDocuments(filter),
    ]);

    res.status(200).json({
      data: articles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("author", "email");
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createArticle = async (req, res) => {
  try {
    const body = { ...req.body, author: req.user.id };
    if (body.isPublished && !body.publishedAt) {
      body.publishedAt = new Date();
    }
    const article = new Article(body);
    const saved = await article.save();
    const populated = await saved.populate("author", "email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    if (!canMutateArticle(article, req.user.id)) {
      return res.status(403).json({ message: "You can only edit your own articles" });
    }
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("author", "email");
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    if (!canMutateArticle(article, req.user.id)) {
      return res.status(403).json({ message: "You can only delete your own articles" });
    }
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
