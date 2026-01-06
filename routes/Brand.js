const express = require("express");
const {
  createBrand,
  fetchAllBrands,
  fetchBrandsUserId,
  fetchBrandsByID,
  updateBrands,
  deletebrands,
} = require("../controller/Brand");
const { isAuth } = require("../server/Common");

const router = express.Router();

router
  .get("/user/:id", isAuth(), fetchBrandsUserId)
  .get("/:id", isAuth(), fetchBrandsByID)
  .get("/", fetchAllBrands)
  .patch("/:id", isAuth(), updateBrands)
  .delete("/:id", isAuth(), deletebrands)
  .post("/", isAuth(), createBrand);

exports.router = router;
