var express = require("express");
var router = express.Router();
const {
  createTask,
  getTaskList,
  updateTask,
  getTaskByid,
  deleteTask,
} = require("../controllers/task.controller.js");

router.get("/", getTaskList);
router.post("/", createTask);
router.get("/:taskId", getTaskByid);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
module.exports = router;
