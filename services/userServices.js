const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CustomError = require("../helpers/CustomError");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const sesClient = require("../config/ses-client");

class UsersService {
  async signupUser(data) {
    if (await User.findOne({ email: data.email }))
      throw new CustomError("email already exists");

    const token = await jwt.sign({ email: data.email }, config.secret);

    const user = new User({
      email: data.email,
      password: data.password,
      confirmationCode: token,
    });

    let confirmationCode = token;

    await user.save();

    //   nodemailer.sendConfirmationEmail(user.email, user.confirmationCode);

    sesClient.sendEmail(
      data.email,
      "Hey! Welcome",
      `<h1>Email Confirmation</h1>
      <h2>Hello Pioneer</h2>
      <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
      <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>
      </div>`
    );

    return token;
  }

  async verifyUser(data, confirmationCode) {
    let user = await User.findOne({
      confirmationCode: confirmationCode,
    });

    if (!user) throw new CustomError("User dosen't exist", 404);

    user.status = "Active";

    await user.save();

    return user;
  }

  async signinUser(data) {
    if (!data.email) throw new CustomError("No email specified");
    if (!data.password) throw new CustomError("No password");

    const user = await User.findOne({ email: data.email });

    if (!user) throw new CustomError("Incorrect email");

    if (user.status != "Active")
      throw new CustomError("Pending Account. Please Verify Your Email!", 401);

    const isCorrect = await bcrypt.compare(data.password, user.password);

    if (!isCorrect) throw new CustomError("Incorrect email or password");

    const token = await jwt.sign({ id: user._id, role: "user" }, "canice");

    return token;
  }

  async editUser(userId, data) {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
    });

    if (!user) throw new CustomError("User dosen't exist", 404);

    return user;
  }
}
module.exports = new UsersService();
