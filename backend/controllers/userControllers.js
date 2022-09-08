const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
exports.protect = async (req, res) => {
  let currentUser;
  try {
    // 1)Getting Token And Check If It's There
    // console.log("Cookie : ", req.cookies.jwt);
    if (req.cookies.jwt) {
      let token = req.cookies.jwt;
      // console.log("Token", token);
      // 2 Verification Token
      const decoded = await promisify(jwt.verify)(token, "Sadeem");
      // very important step 🙃
      // console.log(decoded);
      // 3) Check If The User Still Exist
      currentUser = await User.findById(decoded._id);
      // console.log(currentUser);
      req.user = currentUser;
      res.status(200).json({
        message: "success",
        user: currentUser,
      });
    } else {
      res.status(200).json({
        message: "not logged in",
        // user: currentUser,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(200).json({ message: err.message });
  }
};
exports.logOut = (req, res) => {
  res.status(202).clearCookie("jwt").send("cookie cleared");
};
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    console.log(err);
  }
};
