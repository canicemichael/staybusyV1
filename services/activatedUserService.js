const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ActiveUser = require("../models/activatedUser");
const CustomError = require("../helpers/CustomError");

class ActivatedUsersService {
  async completeUserProfile(data) {
    const user = await User.findOne({ _id: userId });
    if (!user) throw new CustomError("User doesn't exist", 404); // if the ID used as parameter is invalid

    const activeUser = new ActiveUser(data);

    await activeUser.save();

    return activeUser;
  }
}
module.exports = new ActivatedUsersService();
