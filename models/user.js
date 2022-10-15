const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    fullname: {
      type: String,
    },
    location: {
      type: String,
    },
    alternative_email: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    country: {
      type: String,
    },
    prefered_currency: {
      type: String,
    },
    city: {
      type: String,
    },
    periodAvailable: {
      type: String,
    },
    imgUrl: {
      type: String,
      default: "/uploads/defaultImg.png",
    },
    // role: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Role",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

// UserSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     { _id: this._id, isAdmin: this.isAdmin },
//     config.secret
//   );
//   return token;
// };

UserSchema.pre("save", async function (next) {
  try {
    const saltRounds = 10;
    let hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
  } catch (error) {
    next(error);
  }
  next();
});

const User = mongoose.model("User", UserSchema);

const validateUser = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().min(6).max(1025).required(),
    status: Joi.string(),
  });
  return schema.validate(data);
};

module.exports.User = User;
module.exports.validateUser = validateUser;
