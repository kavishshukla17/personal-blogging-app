const { body, validationResult } = require("express-validator");

const validateArticleUpdate = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("isPublished").optional().isBoolean().withMessage("isPublished must be true or false"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateArticleUpdate;
