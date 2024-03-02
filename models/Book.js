const { Schema, model, Types } = require("mongoose");

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide book title"],
    },
    author: {
      type: String,
      required: [true, "Please provide book title"],
    },
    price: {
      type: Number,
      required: [true, "Please provide book title"],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "Users",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = model("Books", BookSchema);
