const Account = require("../models/accountModel");
const User = require("../models/user");

exports.createNewAccount = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
  }
};
exports.getAccounts = async (req, res) => {
  try {
    const account = await Account.find();
    res.status(200).json({ account: account });
  } catch (err) {
    console.log(err);
  }
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
