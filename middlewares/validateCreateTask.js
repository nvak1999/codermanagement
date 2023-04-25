const { validationResult, body } = require("express-validator");
const validateCreateTask = [
  body("name").trim().not().isEmpty(),
  body("description").trim().not().isEmpty(),
  body("status").isIn(["pending", "working", "review", "done", "archive"]),
  body("assignee").isMongoId(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        errors: errors.array(),
      });
    }
    next();
  },
];
module.exports = validateCreateTask;
