const express = require("express");
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");

const router = express.Router();

const UsersController = require("../controllers/UsersController");
const User = require("../models/User");

router.post("/login", UsersController.login);

router.post(
  "/register",
  [
    body("username").notEmpty(),
    body("email").notEmpty(),
    body("email").custom(async (value) => {
      const user = await User.findOne({email : value});
      if (user) {
        throw new Error("E-mail already in use");
      }
    }),
    body("password").notEmpty(),
  ],
  handleErrorMessage,
  UsersController.register
);

module.exports = router;
