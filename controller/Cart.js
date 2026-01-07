const { Cart } = require("../modle/Cart");

// 1. Fetch Cart (Sirf Login User ke liye)
exports.fetchCartByUser = async (req, res) => {
  try {
    const { id } = req.user; // Passport.js ya middleware se id milti hai
    const cartItems = await Cart.find({ user: id }).populate("product");
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json({ message: "Cart load nahi ho saka" });
  }
};

// 2. Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { product, quantity = 1 } = req.body;

    // Check if item already exists
    let item = await Cart.findOne({ user: id, product: product });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = new Cart({ user: id, product, quantity });
      await item.save();
    }

    const result = await item.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: "Add to cart failed" });
  }
};

// 3. Update Cart (Quantity update)
exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params; // Cart ID
    const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true }).populate("product");
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json(err);
  }
};

// 4. Delete from Cart
exports.deleteFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.status(200).json({ id, message: "Deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
};

// 5. Merge Guest Cart (Jab user login kare tab chalao)
exports.mergeGuestCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { guestCart } = req.body; // Array of {product, quantity}

    for (const item of guestCart) {
      const productId = item.product.id || item.product; // Handle both object or string
      let existing = await Cart.findOne({ user: userId, product: productId });

      if (existing) {
        existing.quantity += item.quantity;
        await existing.save();
      } else {
        await Cart.create({ user: userId, product: productId, quantity: item.quantity });
      }
    }
    // Poora updated cart wapis bhejein
    const finalCart = await Cart.find({ user: userId }).populate("product");
    res.status(200).json(finalCart);
  } catch (err) {
    res.status(400).json({ message: "Merge error" });
  }
};