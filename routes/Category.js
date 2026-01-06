const express = require("express");
const {
  createCategory,
  fetchAllCategories,
  fetchUserCategories,
  updateCategory,
  deleteCategory,
  fetchCategoriesByID,
} = require("../controller/Category");
const { isAuth } = require("../server/Common");

const router = express.Router();
router
  .get("/", fetchAllCategories)
  .get("/:id", isAuth(), fetchCategoriesByID)
  .get("/user/:userid", isAuth(), fetchUserCategories)
  .post("/", isAuth(), createCategory)
  .patch("/:id", isAuth(), updateCategory)
  .delete("/:id", isAuth(), deleteCategory);

exports.router = router;
