const jwt = require("jsonwebtoken");
const User = require("../models/user");
const jwtSecret = "1234abc";

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    const user = jwt.verify(token, jwtSecret);
    console.log("USER iD =======>>>>>", user.userId);
    const result = await User.findByPk(user.userId);
    //console.log(JSON.stringify(result));
    req.user = result;
    console.log("auth============>>>>", req.user);
    next();
  } catch (err) {
    console.log("err in auth", err);
  }
};

module.exports = { authenticate };
