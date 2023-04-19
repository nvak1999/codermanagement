const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "working", "review", "done", "archive"],
  },
  createdAt: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  updatedAt: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  assignee: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  isDeleted: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
