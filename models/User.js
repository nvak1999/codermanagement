const mongoose = require("mongoose");

const userScherma = mongoose.Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["employee", "manage"],
    default: "employee",
    require: true,
  },
  isDeleted: { type: Boolean, default: false },
});
const User = mongoose.model("User", userScherma);
module.exports = User;
