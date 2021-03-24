const {User} = require("../models/user");
const Cart = require("../models/cart");

const showShoppingCart = async (req, res) => {
    const user = await User.findOne({ _id: req.user.user._id });
    const userId = user;
    let errors = [];
    try {
        const userCart = await Cart.findOne({ userId: req.user.user._id });
        
        const cart = await Cart.findOne({ userId }).populate('userId');
        if (cart.products.length == 0) {
        return errors.push({msg: "Your cart is empty."}), 
            res.render("user/shoppingCart.ejs", {
                cartitems: cart.products,
                user: req.user.user,
                totalAmount: cart.totalAmount,
                errors,
                userCart: userCart
            })
        } else {
            res.render("user/shoppingCart.ejs", {
                cartitems: cart.products,
                user: req.user.user,
                totalAmount: cart.totalAmount,
                userCart: userCart
            })
        }
    } catch (err) {
        console.log(err.message) // If person without a cart clicks on cart, it will throw Error. 
        req.flash("warning_msg", "You must add a product to your shopping cart first!") // This is to message customer he needs to add a product
        res.redirect("/productPage") //  And make the productpage reload instead of getting stuck to shoppingcart.
    }
}

const addToCart = async (req, res) => {
    const { title, price, productId, quantity, blend } = req.body;
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
                    total,
                    blend
                }]
            });
            let cart = await Cart.findOne({ userId });
            for (i = 0; i < cart.products.length; i++) {
                userTotal = cart.products[i].total;
                cart.totalAmount = userTotal;
            }
            await cart.save();
            req.flash("success_msg", "The product has been added to your cart.")
            res.redirect("back")
        }
        if (cart) { // If cart exists for customer already
            let cartItem = cart.products.findIndex((p) => p.productId == productId); // <-- Map loop

            if (cartItem >- 1) { 
                let productItem = cart.products[cartItem]; // If product exist in cart, update the quantity 
                productItem.quantity = quantity;
                cart.products[cartItem] = productItem;

                let productTotalPrice = cart.products[cartItem]; // if product exists in cart, update the total price
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
                cart.products.push({ title, price, productId, quantity, blend, total });
            }
            await cart.save();
            req.flash("success_msg", "The product has been added to your cart.")
            res.redirect("back")
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
        if (cart.products.length >= 1) {
        req.flash("warning_msg", "Product removed")
        }
        res.redirect("/myShoppingCart")
    } catch (err) {
        console.log(err)
    }
}

const clearCartTotal = async (req, res) => {
    const user = await User.findOne({ _id: req.user.user._id });
    const userId = user;
    const cart = await Cart.findOne({ userId });
    try {
        cart.products = [];
        cart.totalAmount = 0;
        await cart.save();

        res.redirect("/myShoppingCart");
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
          cart.totalAmount -= pastValue; // Removes past value from totalAmount
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
    addToCart,
    removeFromCart,
    clearCartTotal,
    increaseInCart,
    decreaseInCart
}