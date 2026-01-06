  const mongoose = require("mongoose");

  const productSchema = new mongoose.Schema(
    {
      productType: {
        type: String,
        enum: ["simple-product", "variable-product", "affiliate-product"],
        required: true,
      },
      title: {
        productName: {
          type: String,
          required: true,
        },
      },
      thumbnail: {
        type: String,
        required: true,
      },
      galleryImages: {
        type: [String],
        default: [],
      },
      description: {
        type: String,
        required: true,
      },
      productStatus: {
        type: String,
        required: true,
        enum: ["public", "private", "draft"],
      },
      productData: {
        type: Object,
      },
      categories: {
        type: String,
        required: true,
      },
      brands: {
        type: String,
      },
      subcategories: [{ type: mongoose.Schema.Types.String, ref: "subcategory" }],
      tags: [{ type: mongoose.Schema.Types.String, ref: "tags" }],

      discountPercentage: {
        type: Number,
        default: 0,
      },
      quantity: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      isdeleted: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

  productSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });

  productSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });

  exports.Product = mongoose.model("Product", productSchema);
