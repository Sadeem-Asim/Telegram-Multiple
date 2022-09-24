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
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");
  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      // if (err) throw err;
      if (result === true) {
        console.log(result);
        user.password = undefined;
        let { _id } = user;
        const token = jwt.sign({ _id }, "Sadeem", { expiresIn: "90d" });
        const cookieOptions = {
          expires: new Date(Date.now() + 9000000 * 24 * 60 * 60 * 1000 * 10000),
          secure: true,
          httpOnly: true,
        };
        res.cookie("jwt", token, cookieOptions);
        req.user = user;
        res.status(200).json({
          message: "success",
          user,
        });
      } else {
        res
          .status(200)
          .send({ status: "failed", message: "Invalid Username Or Password" });
      }
    });
  }
};
exports.register = (req, res) => {
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
      res.send("User Created");
    }
  });
};
