const jwt = require("jsonwebtoken");

require("dotenv").config();

const verifyAdmin = async (req, res, next) => {
  const token = req.cookies.jwtToken;

  if (!token) return res.redirect("/login");

  const validUser = jwt.verify(token, process.env.SECRET_KEY);

  if (validUser.user.role !== "admin") return res.redirect("/login");

  req.user = validUser;

  next();
};

module.exports = verifyAdmin;
