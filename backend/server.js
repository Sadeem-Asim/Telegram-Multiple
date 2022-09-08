const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const {
  protect,
  logOut,
  getUsers,
} = require("./controllers/userControllers.js");
const accountRouter = require("./routers/accountRouters");
const userRouter = require("./routers/userRouter");
//----------------------------------------- END OF IMPORTS---------------------------------------------------

mongoose.connect(
  "mongodb://localhost:27017/telegram",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log("Db Connection Successful");
  }
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes
app.use("/", accountRouter);
app.use("/", userRouter);
app.get("/logOut", logOut);
app.get("/isLoggedIn", protect);
app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");
  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      // if (err) throw err;
      if (result === true) {
        console.log(result);
        user.password = undefined;
        let { _id } = user;
        const token = jwt.sign({ _id }, "Sadeem", { expiresIn: "24h" });
        const cookieOptions = {
          expires: new Date(Date.now() + 9000000 * 24 * 60 * 60 * 1000),
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
});

app.post("/register", (req, res) => {
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
});
app.get("/users", getUsers);
//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(4000, () => {
  console.log("Server Has Started");
});
