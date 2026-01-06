const mongoose = require("mongoose");
const { Schema } = mongoose;

const attributeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    values: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

attributeSchema.virtual("id").get(function () {
  return this._id;
});

attributeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Attribute = mongoose.model("Attribute", attributeSchema);
