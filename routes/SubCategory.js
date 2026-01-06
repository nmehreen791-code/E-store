const express = require("express");
const {
  addSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoriesById,
} = require("../controller/SubCategory");
const { isAuth } = require("../server/Common");

const router = express.Router();
router
  .post("/", isAuth(), addSubCategory)
  .get("/", isAuth(), getSubCategories)
  .get("/:id", isAuth(), getSubCategoriesById)
  .patch("/:id", isAuth(), updateSubCategory)
  .delete("/:id", isAuth(), deleteSubCategory);

exports.router = router;
