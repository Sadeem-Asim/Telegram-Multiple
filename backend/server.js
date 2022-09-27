const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
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

mongoose
  .connect(
    "mongodb+srv://sadeem:swing000@mycluster.h81avmf.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("DB Connection Successful");
  });

// Middleware

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Set-Cookie", "HttpOnly;Secure;SameSite=None");
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://cdnjs.cloudflare.com"
  );
  next();
});

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
process.on("uncaughtException", (err) => {
  console.log("Error 💥", err.name, err.message, err.stack);
});
//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes
app.use("/", accountRouter);
app.use("/", userRouter);
//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(process.env.PORT || 4000, () => {
  console.log("Server Has Started");
});
process.on("unhandledRejection", (err) => {
  console.log("Error 💥", err.name, err.message, err.stack);
  console.log("Unhandled Rejection Shutting Down");
});
