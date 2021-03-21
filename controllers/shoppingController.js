const {User} = require("../models/user");
const Cart = require("../models/cart");

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
            await cart.save();
            res.redirect("/myShoppingCart")
        }
    } catch (err) {
        console.log(err)
    }
}

const removeFromCart = async (req, res) => {
    const user = await User.findOne({ _id: req.user.user._id });
    const userId = user;
    try {
        const cart = await Cart.findOne({ userId });
        const productId = req.params.id;

        for (i = 0; i < cart.products.length; i++) { // Empties totalAmount value if product is removed
            if (productId == cart.products[i]._id) {
              productTotal = cart.products[i].total;
              dataBaseTotalAmount = cart.totalAmount;
              dataBaseTotalAmount -= productTotal;
              cart.totalAmount = dataBaseTotalAmount;
              if (cart.totalAmount <= 0) {
                cart.totalAmount = 0;
              }
              await cart.save();
            }
        }
        cart.products.pull({ _id: productId });
        await cart.save();
        req.flash("warning_msg", "Product removed")
        res.redirect("/myShoppingCart")
    } catch (err) {
        console.log(err)
    }
}

const increaseInCart = async (req, res) => {
    const user = await User.findOne({ _id: req.user.user._id });
    const userId = user;
    const productId = req.params.id;
    try {
      const cart = await Cart.findOne({ userId });
      for (i = 0; i < cart.products.length; i++) {
        if (cart.products[i]._id == productId) {
          let pastValue = cart.products[i].total;
          cart.products[i].quantity++; // Increase quantity by one
          cart.products[i].total = cart.products[i].quantity * cart.products[i].price;
  
          let newValue = cart.products[i].total;
          cart.totalAmount -= pastValue; // Removes past vaule from totalAmount
          cart.totalAmount += newValue; // Adds new value to totalAmount
  
          await cart.save();
        }
      }
        res.redirect('/myShoppingCart');
    } catch (err) {
        console.log(err)
    }
}

const decreaseInCart = async (req, res) => {
    const user = await User.findOne({ _id: req.user.user._id });
    const userId = user;
    const productId = req.params.id;
    try {
      const cart = await Cart.findOne({ userId });
      for (i = 0; i < cart.products.length; i++) {
        if (cart.products[i]._id == productId) {
          if (cart.products[i].quantity == 1) { // Can't go lower than 1, otherwise customer will have to remove product with Remove from Cart function
              break
          } else {
          let pastValue = cart.products[i].total;
          cart.products[i].quantity--; // decrease quantity by one
          cart.products[i].total = cart.products[i].quantity * cart.products[i].price;
  
          let newValue = cart.products[i].total;
          cart.totalAmount -= pastValue; // Removes past value from totalAmount
          cart.totalAmount += newValue; // Adds new value to totalAmount
  
          await cart.save();
          }
        }
      }
        res.redirect('/myShoppingCart');
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    showShoppingCart,
    addtoCart,
    removeFromCart,
    increaseInCart,
    decreaseInCart
}