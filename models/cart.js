const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [
    {
      title: { type: String },
      blend: { type: String },
      price: { type: Number },
      productId: { type: String },
      quantity: { type: Number, default: 0 },
      total: { type: Number },
    },
  ],
  userId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  totalAmount: { type: Number },
});

cartSchema.methods.addToCart = async function (productId) {
  this.userId.push(productId);
  await this.save();
};

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
