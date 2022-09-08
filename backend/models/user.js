const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: { type: String, select: false },
    accounts: [{ type: mongoose.Schema.ObjectId, ref: "Account" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "accounts",
    populate: { path: "accounts" },
  });
  next();
});

userSchema.virtual("account", {
  ref: "Account",
  foreignField: "user",
  localField: "_id",
});

module.exports = mongoose.model("User", userSchema);
