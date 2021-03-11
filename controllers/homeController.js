const startPage = (req, res) => {
    try {
        res.render("index.ejs")
    } catch (err) {
        console.log(err)
    };
}

const logout = (req, res) => {
    res.clearCookie("jwtToken");
    // req.flash("success_msg", "You are now logged out!");
    res.redirect("/");
  }

  module.exports = {
      startPage,
      logout
  }
  