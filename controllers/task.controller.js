const { default: mongoose } = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils");

const Task = require("../models/Task.js");

const taskController = {};

taskController.createTask = async (req, res, next) => {
  const newTask = req.body;

  try {
    const taskList = await Task.find({});
    taskList.map((e) => {
      if (e.name === newTask.name)
        throw new AppError(409, "Duplicate task", " Task already exists");
    });
    if (!newTask) throw new AppError(402, "Bad Request", "Create User Error");
    const created = await Task.create(newTask);
    sendResponse(res, 200, true, { created }, null, "Create Task Successs");
  } catch (error) {
    next(error);
  }
};

taskController.getTaskList = async (req, res, next) => {
  try {
    const taskList = await Task.find({});
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

  try {
    const data = await Task.findById(taskId);
    sendResponse(res, 200, true, { data }, null, "Get Task Successs");
  } catch (error) {
    next(error);
  }
};
taskController.updateTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  const updateData = req.body;

  try {
    const oldData = await Task.findById(taskId);
    if (oldData.status === "archive")
      throw new AppError(402, "Bad Request", "This task can't be change");
    else if (oldData.status === "done" && updateData.status === "archive") {
      const newUpDate = await Task.findByIdAndUpdate(
        taskId,
        { status: "archive" },
        {
          new: true,
        }
      );
      sendResponse(res, 200, true, { newUpDate }, null, `Update Task Successs`);
    } else {
      const newUpDate = await Task.findByIdAndUpdate(taskId, updateData, {
        new: true,
      });
      sendResponse(
        res,
        200,
        true,
        { newUpDate },
        null,
        `Update Task Successs `
      );
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
