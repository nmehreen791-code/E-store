const express = require("express");

const { isAuth } = require("../server/Common");
const {
  createTags,
  fetchAllTags,
  fetchTagsUserId,
  fetchTagsByID,
  updateTags,
  deleteTags,
} = require("../controller/Tags");

const router = express.Router();

router
  .post("/", isAuth(), createTags)
  .get("/user/:userId", isAuth(), fetchTagsUserId)
  .get("/:id", fetchTagsByID)
  .get("/", fetchAllTags)
  .patch("/:id", isAuth(), updateTags)
  .delete("/:id", isAuth(), deleteTags);

exports.router = router;
