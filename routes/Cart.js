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
  .post("/", isAuth(), addToCart)
  .get("/", isAuth(), fetchCartByUser)
  .delete("/:id",isAuth(),  deleteFromCart)
  .patch("/:id",isAuth(),  updateCart)
  .post("/merge",isAuth(),  mergeGuestCart);

exports.router = router;
