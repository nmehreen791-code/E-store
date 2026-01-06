const express = require("express");
const {
  addAttribute,
  deleteAttribute,
  getAttributes,
  updateAttribute,
} = require("../controller/Attributes");
const { isAuth } = require("../server/Common");
const router = express.Router();

router
  .post("/", isAuth(), addAttribute)
  .get("/:userid", isAuth(), getAttributes)
  .patch("/:id", isAuth(), updateAttribute)
  .delete("/:id", isAuth(), deleteAttribute);

exports.router = router;
