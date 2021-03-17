const express = require('express');
const mongoose = require('mongoose');
const cookieparser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");

const app = express();

require('dotenv').config();

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cookieparser());

app.set("view engine", "ejs");

app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
  );
  
  app.use(flash());
  
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.warning_msg = req.flash("warning_msg");
    next();
  });

app.use(userRoute);
app.use(productRoute);

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true, 
    useFindAndModify: false
    }, () => {
    app.listen(process.env.PORT, () => {
        console.log("Server is up and running on port 8000");
    });
});