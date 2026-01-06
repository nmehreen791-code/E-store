const mongoose = require("mongoose");
const { Schema } = mongoose;

const tagSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const virtual = tagSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

tagSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Tags = mongoose.model("Tags", tagSchema);
