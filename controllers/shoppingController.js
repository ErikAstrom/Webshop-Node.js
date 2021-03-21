const {User} = require("../models/user");
const Cart = require("../models/cart");
const fs = require("fs");
const path = require("path");

const addtoCart = async (req, res) => {
    const { title, price, productId, quantity } = req.body;
    const total = price * quantity;
    const user = await User.findOne({ _id: req.user.user._id });
    const userId = user;
    totalAmount = '';
    let userTotal = total;
    let userTotalAmount = 0;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) { // If no cart exists for customer, creates a new
            await Cart.create({
                totalAmount, 
                userId,
                products: [{ 
                    productId, 
                    // img: {
                    // data: fs.readFileSync(path.join("uploads/" + req.file.filename)),
                    // contentType: "image"
                    // }, 
                    quantity,
                    title, 
                    price, 
                    total 
                }]
            });
            let cart = await Cart.findOne({ userId });
            for (i = 0; i < cart.products.length; i++) {
                userTotal = cart.products[i].total;
                cart.totalAmount = userTotal;
            }
            await cart.save();
            res.redirect("/myShoppingCart")
        }
        if (cart) { // If cart exists for customer already
            let cartItem = cart.products.findIndex((p) => p.productId == productId); // <-- Map loop

            if (cartItem >- 1) { 
                let productItem = cart.products[cartItem]; // If product exist in cart, update the quantity 
                productItem.quantity = quantity;
                cart.products[cartItem] = productItem;

                let productTotalPrice = cart.products[cartItem]; // if product exists in cart, update the total
                productTotalPrice.total = total;
                cart.products[cartItem] = productTotalPrice;

                for (i = 0; i < cart.products.length; i++) { // If product exists in cart, update the total amount
                    userTotalAmount += cart.products[i].total;
                    cart.totalAmount = userTotalAmount;
                }
            } else {
                for (i = 0; i < cart.products.length; i++) { // If product is new to cart
                    userTotal += cart.products[i].total;
                    cart.totalAmount = userTotal;
                }
                if (cart.totalAmount == 0) { // If user has removed all items
                    cart.totalAmount = userTotal;
                }
                cart.products.push({ title, price, productId, quantity, total });
            }
            cart = await cart.save();
            res.redirect("/myShoppingCart")
        }
    } catch (err) {
        console.log(err)
    }
}

const showShoppingCart = async (req, res) => {
    const user = await User.findOne({ _id: req.user.user._id });
    const userId = user;
    try {
        const cart = await Cart.findOne({ userId }).populate('userId');

        res.render("user/shoppingCart.ejs", {
            cartitems: cart.products,
            user: req.user.user,
            totalAmount: cart.totalAmount,
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    addtoCart,
    showShoppingCart,
}