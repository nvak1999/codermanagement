var express = require("express");
var router = express.Router();
const {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
} = require("../controllers/user.controller");

router.get("/", getAllUser);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);
router.post("/", createUser);
module.exports = router;
