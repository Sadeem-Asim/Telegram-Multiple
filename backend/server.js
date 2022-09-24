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
//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(4000, () => {
  console.log("Server Has Started");
});
