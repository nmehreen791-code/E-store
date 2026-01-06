const { Product } = require("../modle/Product");

async function generateImageUrl(base64Image) {
  return base64Image;
}

exports.createProduct = async (req, res) => {
  try {
    console.log("Received product data:", req.body);

    const {
      productType,
      title,
      galleryImages,
      productData,
      description,
      userId,
      rating,
      thumbnail,
      discountPercentage,
      productStatus,
      categories,
      subcategories,
      brands,
      tags,
    } = req.body;

    console.log("categories:", categories);
    console.log("brand:", brands);

    if (
      !productType ||
      !title ||
      !description ||
      !userId ||
      rating === undefined ||
      !thumbnail ||
      !categories ||
      !subcategories ||
      !brands ||
      !tags
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const imageUrls = await Promise.all(
      galleryImages.map(async (img) => {
        return await generateImageUrl(img);
      })
    );

    const thumbnailUrl = await generateImageUrl(thumbnail);

    const newProduct = new Product({
      productType,
      title,
      galleryImages: imageUrls,
      productData,
      description,
      userId,
      productStatus,
      rating,
      thumbnail: thumbnailUrl,
      discountPercentage: discountPercentage || 0,
      categories,
      subcategories,
      brands,
      tags,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res
      .status(500)
      .json({ message: "Failed to create product.", error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const totalProduct = await Product.countDocuments();

    res.set("X-Total-Count", totalProduct);

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch products.", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch product.", error: error.message });
  }
};
 
exports.getProductsByUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  const { id } = req.user;

  try {
    const products = await Product.find({ userId: id });

    const totalProduct = await Product.countDocuments();

    res.set("X-Total-Count", totalProduct);

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products for user ID:", id, error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    productType,
    title,
    galleryImages,
    productData,
    description,
    rating,
    thumbnail,
    discountPercentage,
    productStatus,
    isdeleted,
  } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (productType) product.productType = productType;
    if (title) product.title = title;
    if (description) product.description = description;
    if (rating !== undefined) product.rating = rating;
    if (thumbnail) product.thumbnail = await generateImageUrl(thumbnail);
    if (discountPercentage !== undefined)
      product.discountPercentage = discountPercentage;
    if (productStatus) product.productStatus = productStatus;

    if (galleryImages) {
      const imageUrls = await Promise.all(
        galleryImages.map(async (img) => {
          return await generateImageUrl(img);
        })
      );
      product.galleryImages = imageUrls;
    }

    if (productData) {
      product.productData = productData;
    }

    if (isdeleted !== undefined) {
      product.isdeleted = isdeleted;
    }

    const updatedProduct = await product.save();

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ message: "Failed to update product.", error: error.message });
  }
};
