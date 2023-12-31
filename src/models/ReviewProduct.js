const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, //id của người dùng
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }, //id sản phẩm
    rating: { type: Number, required: true }, //đánh giá sản phẩm
    comment: { type: String, required: true }, //bình luận về sản phẩm
    images: [
      {
        imageUrl: {
          type: String,
          // required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
