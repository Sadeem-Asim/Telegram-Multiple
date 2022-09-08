const Account = require("../models/accountModel");
const User = require("../models/user");
exports.createNewAccount = async (req, res) => {
  const account = await Account.create(req.body);
  console.log(account.id);
  const updatedUser = await User.findOneAndUpdate(
    { username: "sadeem" },
    {
      $push: { accounts: account.id },
    },
    { new: true }
  );
  console.log(updatedUser);
  res.json({
    message: "success",
    account,
    updatedUser,
  });
};
exports.getAccounts = async (req, res) => {
  const account = await Account.find();
  res.status(200).json({ account: account });
};
