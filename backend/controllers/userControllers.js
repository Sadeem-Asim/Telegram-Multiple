const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

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
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(200).json({ message: err.message });
  }
};
exports.logOut = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.send("cookie cleared");
    // req.session.destroy();
    // req.cookies = undefined;
    // cookies.set("jwt", { expires: Date.now() });
    // res.cookie("jwt", "", { expires: Date.now() });
  } catch (error) {
    console.log(error);
  }
};
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    console.log(err);
  }
};
exports.isLoggedIn = async (req, res, next) => {
  let currentUser;
  try {
    // 1)Getting Token And Check If It's There
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
    }
  } catch (err) {
    console.log(err.message);
  }
  next();
};
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        // if (err) throw err;
        if (result === true) {
          console.log(result);
          user.password = undefined;
          let { _id } = user;
          const token = jwt.sign({ _id }, "Sadeem", { expiresIn: "365d" });
          const cookieOptions = {
            expires: new Date(Date.now() + 9000000 * 24 * 60 * 60 * 1000),
            secure: true,
            httpOnly: true,
            sameSite: "None",
            path: "/",
          };
          res.cookie("jwt", token, cookieOptions);
          req.user = user;
          res.status(200).json({
            message: "success",
            user,
          });
        } else {
          res.status(200).send({
            message: "failed",
          });
        }
      });
    } else {
      res.status(200).send({
        message: "failed",
      });
    }
  } catch (error) {
    res.status(200).send({
      message: "failed",
    });
  }
};
exports.register = async (req, res) => {
  try {
    User.findOne({ username: req.body.username }, async (err, doc) => {
      if (err) throw err;
      if (doc) res.send("User Already Exists");
      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        await newUser.save();
        res.json({
          message: "success",
        });
      }
    });
  } catch (error) {
    res.send("error");
  }
};
