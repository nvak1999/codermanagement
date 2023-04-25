const { default: mongoose } = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils");
const { validationResult, check, body } = require("express-validator");

const Task = require("../models/Task.js");
const taskController = {};

taskController.createTask = async (req, res, next) => {
  const newTask = req.body;

  try {
    const duplicateTask = await Task.findOne({ name: newTask.name });
    if (duplicateTask) {
      throw new AppError(409, "Duplicate task", "Task already exists");
    }
    if (!newTask) throw new AppError(402, "Bad Request", "Create User Error");
    const created = await Task.create(newTask);
    sendResponse(res, 200, true, { created }, null, "Create Task Successs");
  } catch (error) {
    next(error);
  }
};

taskController.getTaskList = async (req, res, next) => {
  try {
    const taskList = await Task.find({ isDeleted: false });
    sendResponse(
      res,
      200,
      true,
      { taskList: taskList },
      null,
      "Get Task list Successs"
    );
  } catch (error) {
    next(error);
  }
};

taskController.getTaskByid = async (req, res, next) => {
  const taskId = req.params.taskId;
  let isValid = mongoose.Types.ObjectId.isValid(taskId);
  try {
    if (isValid === false)
      throw new AppError(404, "Not Found", "Couldn't find that resource");
    else {
      const data = await Task.findById(taskId);
      sendResponse(res, 200, true, { data }, null, "Get Task Successs");
    }
  } catch (error) {
    next(error);
  }
};

taskController.updateTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  const updateData = req.body;

  try {
    const oldData = await Task.findById(taskId);
    if (oldData.status === "done" && updateData.status !== "archive") {
      throw new AppError(402, "Bad Request", "This task can't be changed");
    } else if (oldData.status === "archive") {
      throw new AppError(
        402,
        "Bad Request",
        "This task is already archived and cannot be changed"
      );
    } else {
      const newUpdate = await Task.findByIdAndUpdate(taskId, updateData, {
        new: true,
      });
      sendResponse(res, 200, true, { newUpdate }, null, `Update Task Success`);
    }
  } catch (error) {
    next(error);
  }
};

taskController.deleteTask = async (req, res, next) => {
  taskId = req.params.taskId;
  try {
    const deleteTask = await Task.findByIdAndUpdate(
      taskId,
      { isDeleted: true },
      { new: true }
    );
    sendResponse(res, 200, true, { deleteTask }, null, `Delete Task Successs `);
  } catch (error) {
    next(error);
  }
};
module.exports = taskController;
