const User = require("../models/user");

const adminRender = (req,res)=> {

    res.render("admin/admin.ejs")

}




module.exports = {
    adminRender
}