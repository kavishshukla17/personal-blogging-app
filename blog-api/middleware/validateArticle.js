const { body, validationResult } = require('express-validator');

const validateArticle = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('content')
    .notEmpty().withMessage('Content is required'),

  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),

  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be true or false'),

  // This runs after the checks and returns errors if any
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateArticle;