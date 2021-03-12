const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyUser = (req,res,next)=>  {

    const token = req.cookies.jwtToken;

    if(!token) return res.redirect("/login", {err: "Du måste logga in"});

    const validUser = jwt.verify(token, process.env.SECRET_KEY)

if (validUser) {
    req.user = validUser;
}
next();
}

module.exports = verifyUser;