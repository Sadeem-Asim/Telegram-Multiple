const Account = require("../models/accountModel");
const User = require("../models/user");

exports.createNewAccount = async (req, res) => {
  const { apiId, apiHash, phoneNo, token } = req.body;
  const account = await Account.create({ apiId, apiHash, phoneNo, token });
  const username = req.body.username;
  const updatedUser = await User.findOneAndUpdate(
    { username },
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
exports.deleteAccount = async (req, res) => {
  try {
    const { _id, username } = req.body;
    await Account.findOneAndDelete({ _id });
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
};
