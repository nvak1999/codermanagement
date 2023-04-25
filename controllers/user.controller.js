const { Types, default: mongoose } = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils");
const { body, validationResult } = require("express-validator");

const User = require("../models/User.js");

const userController = {};

userController.createUser = async (req, res, next) => {
  const data = req.body;

  try {
    await body("name").exists().isString().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dataName = await User.find({ name: data.name });
    if (dataName.length > 0)
      throw new AppError(400, "Dulicate name", "This name already exists");

    const created = await User.create(data);
    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Create User Successs"
    );
  } catch (error) {
    next(error);
  }
};

userController.getAllUser = async (req, res, next) => {
  const search = req.query;

  try {
    let filter = {};

    if (search.search) filter = { name: search.search };

    const listUser = await User.find(filter);

    sendResponse(res, 200, true, { listUser }, null, "Get User Success");
  } catch (error) {
    next(error);
  }
};

userController.getUserById = async (req, res, next) => {
  const userId = req.params.userId;
  let isValid = mongoose.Types.ObjectId.isValid(userId);
  try {
    if (isValid === false)
      throw new AppError(404, "Not Found", "Couldn't find that resource");
    else {
      const data = await User.aggregate([
        { $match: { _id: new Types.ObjectId(userId) } },
        {
          $lookup: {
            from: "tasks",
            as: "listOfTask",
            localField: "_id",
            foreignField: "assignee",
          },
        },
        {
          $project: {
            default: 0,
            "listOfTask.name": 0,
          },
        },
      ]);

      sendResponse(res, 200, true, { data }, null, "Get User Success");
    }
  } catch (error) {
    next(error);
  }
};
userController.updateUser = async (req, res, next) => {
  const updateInfo = req.body;
  const targetId = req.params.userId;
  try {
    const updated = await User.findByIdAndUpdate(targetId, updateInfo, {
      new: true,
    });
    sendResponse(
      res,
      200,
      true,
      { data: updated },
      null,
      "Update User success"
    );
  } catch (error) {
    next(error);
  }
};
module.exports = userController;
