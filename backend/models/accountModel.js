const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema(
  {
    apiId: {
      type: String,
      unique: true,
      required: [true, "api Id is required"],
    },
    apiHash: {
      type: String,
      unique: true,
      required: [true, "app hash is required"],
    },
    phoneNo: {
      type: String,
      unique: true,
      required: [true, "phone no is required"],
    },
    token: { type: String, unique: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

accountSchema.pre(/^find/, function (next) {
  this.populate({ path: "user" });
  next();
});

module.exports = mongoose.model("Account", accountSchema, "Account");
