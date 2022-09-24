const express = require("express");
const accountController = require("./../controllers/accountControllers");

const router = express.Router();

router.post("/createAccount", accountController.createNewAccount);
router.get("/getAccounts", accountController.getAccounts);
router.delete("/deleteAccount", accountController.deleteAccount);
module.exports = router;
