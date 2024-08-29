const express = require("express");
const OptionGroupController = require("../controllers/OptionGroupController");
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");

const router = express.Router();

router.get("", OptionGroupController.index);

router.post(
  "",
  [
    body("title").notEmpty(),
    body('options').notEmpty(),
    body('options.*.name').notEmpty(),
    body('options.*.price').notEmpty()
  ],
  handleErrorMessage,
  OptionGroupController.store
);

router.get("/:id", OptionGroupController.show);

router.delete("/:id", OptionGroupController.destroy);

router.patch("/:id", OptionGroupController.update);

module.exports = router;
