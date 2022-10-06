const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CustomError = require("../helpers/CustomError");
const config = require("../config/auth.config");
const nodemailer = require("nodemailer");

class UsersService {
  async signupUser(data) {
    if (await User.findOne({ email: data.email }))
      throw new CustomError("email already exists");

    // const user = new User({
    //   email: req.body.email,
    //   password: req.body.password,
    //   confirmationCode: token,
    // });

    const token = await jwt.sign({ email: data.email }, config.secret);

    const user = new User(data, (data.confirmationCode = token));

    await user.save(
      nodemailer.sendConfirmationEmail(
        user.username,
        user.email,
        user.confirmationCode
      )
    );

    return token;
  }

  async signinUser(data) {
    if (!data.email) throw new CustomError("No email specified");
    if (!data.password) throw new CustomError("No password");

    const user = await User.findOne({ email: data.email });

    if (!user) throw new CustomError("Incorrect email");

    const isCorrect = await bcrypt.compare(data.password, user.password);

    if (!isCorrect) throw new CustomError("Incorrect email or password");

    const token = await jwt.sign({ id: user._id, role: "user" }, "canice");

    return token;
  }

  async getUsers() {
    return await User.find({});
  }

  async getUser(userId) {
    const user = await User.findOne({ _id: userId });
    if (!user) throw new CustomError("User doesn't exist", 404); // if the ID used as parameter is invalid
    return user;
  }

  async editUser(userId, data) {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
    });

    if (!user) throw new CustomError("User dosen't exist", 404);

    return user;
  }

  async deleteUser(userId) {
    return await User.findOneAndRemove({ _id: userId });
  }
}
module.exports = new UsersService();