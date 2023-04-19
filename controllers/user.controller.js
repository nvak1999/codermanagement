const { Types } = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils");

const User = require("../models/User.js");

const userController = {};

userController.createUser = async (req, res, next) => {
  const data = req.body;
  try {
    if (!data) throw new AppError(402, "Bad Request", "Create User Error");
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
  try {
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
