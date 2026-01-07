
const { Cart } = require("../modle/Cart");

/**
 * ================= FETCH CART (LOGIN USER)
 */
exports.fetchCartByUser = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const cartItems = await Cart.find({
      user: req.user.id,
    }).populate("product");

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

/**
 * ================= ADD TO CART
 * ✔ Guest allowed
 * ✔ Logged-in allowed
 */
exports.addToCart = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: "Guest cart should be handled in localStorage",
    });
  }

  try {
    const userId = req.user.id;
    const { product, quantity = 1 } = req.body;

    const exists = await Cart.findOne({ user: userId, product });

    if (exists) {
      exists.quantity += quantity;
      await exists.save();
      const populated = await exists.populate("product");
      return res.status(200).json(populated);
    }

    const cart = await Cart.create({
      user: userId,
      product,
      quantity,
    });

    const result = await cart.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

/**
 * ================= MERGE GUEST CART AFTER LOGIN (NEW API)
 */
exports.mergeGuestCart = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userId = req.user.id;
    const { guestCart } = req.body;

    for (const item of guestCart) {
      const exists = await Cart.findOne({
        user: userId,
        product: item.product,
      });

      if (exists) {
        exists.quantity += item.quantity;
        await exists.save();
      } else {
        await Cart.create({
          user: userId,
          product: item.product,
          quantity: item.quantity,
        });
      }
    }

    res.status(200).json({
      message: "Guest cart merged successfully",
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

/**
 * ================= DELETE FROM CART
 */
exports.deleteFromCart = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await Cart.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!result) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

/**
 * ================= UPDATE CART
 */
exports.updateCart = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const cart = await Cart.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    ).populate("product");

    if (!cart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json(err);
  }
};
