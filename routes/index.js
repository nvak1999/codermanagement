var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Coder Management");
});

const userRouter = require("./users.api.js");
const taskRouter = require("./task.api.js");
router.use("/task", taskRouter);
router.use("/user", userRouter);

module.exports = router;
