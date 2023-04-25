var express = require("express");
var router = express.Router();
const {
  createTask,
  getTaskList,
  updateTask,
  getTaskByid,
  deleteTask,
} = require("../controllers/task.controller.js");
const validateCreateTask = require("../middlewares/validateCreateTask.js");

router.get("/", getTaskList);
router.post("/", validateCreateTask, createTask);
router.get("/:taskId", getTaskByid);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
module.exports = router;
