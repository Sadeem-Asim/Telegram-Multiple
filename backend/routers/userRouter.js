const express = require("express");
const usersController = require("./../controllers/userControllers");

const router = express.Router();

router.post("/login", usersController.login);
router.post("/register", usersController.register);
router.post("/logOut", usersController.logOut);
router.get("/isLoggedIn", usersController.protect);
router.get("/users", usersController.getUsers);
module.exports = router;
