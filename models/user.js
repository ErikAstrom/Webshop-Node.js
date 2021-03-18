const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  password2: {type: String },
  mailToken: String,
  mailExpiration: Date,
  role: { type: String, default: "customer" },
  date: { type: Date, default: Date.now },
  adminProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
    }
  ],
  wishList: [ // NEW
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
  ],
});

userSchema.methods.addProduct = async function (productId) {
  this.adminProducts.push(productId)
  await this.save();
};

userSchema.methods.removeProduct = async function (productId) {
  this.adminProducts.pull(productId);
  await this.save();
};

userSchema.methods.addWish = async function (wishId, user) { // New
  for (i = 0; i < user.wishList.length; i++) {
    if (user.wishList[i] == wishId) return;
  }
  this.wishList.push(wishId);
  await this.save();
};

function validateUser(user) {

  const schema = Joi.object({
    username: Joi.string().min(5).max(25).required(),
    email: Joi.string().min(2).max(100).required().email(),
    password: Joi.string().min(3).max(35).required(),
    password2: Joi.string().min(3).max(35)

  });
  return schema.validate(user)

};

const User = mongoose.model("user", userSchema);

module.exports = 
{
  User,
  validateUser
}