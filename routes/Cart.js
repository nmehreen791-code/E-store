
const express = require("express");
const {
  fetchCartByUser,
  addToCart,
  updateCart,
  deleteFromCart,
  mergeGuestCart,
} = require("../controller/Cart");
const { isAuth } = require("../server/Common");

const router = express.Router();
// brands is already added in base path
router
  .post("/" , isAuth(), addToCart)
  .get("/", fetchCartByUser)
  .delete("/:id", deleteFromCart)
  .patch("/:id", updateCart)
  .post("/merge", mergeGuestCart);

exports.router = router;
