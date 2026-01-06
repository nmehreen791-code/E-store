const express = require("express");
const {
  createProduct,
  getProducts,
  getProductsByUser,
  getProductById,
  updateProduct,
} = require("../controller/Product");
const { isAuth } = require("../server/Common");

const router = express.Router();

router
  .post("/", createProduct)
  .get("/", getProducts)
  .get("/:id", getProductById)
  .patch("/:id", updateProduct)
  .get("/user/:id", isAuth(), getProductsByUser);

module.exports = { router };
