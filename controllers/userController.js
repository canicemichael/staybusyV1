const {
  signupUser,
  signinUser,
  editUser,
  verifyUser,
} = require("../services/userServices");

const { response } = require("../helpers/messages");
const CustomError = require("../helpers/CustomError");
const { User, validateUser } = require("../models/user");

class UserContoller {
  async signupUser(req, res, next) {
    const { error } = validateUser(req.body);

    const token = await signupUser(req.body);

    res.status(201).send(response("Email Sent", token));
  }

  async verifyUser(req, res, next) {
    const user = await verifyUser(req.params.confirmationCode, req.body);

    if (req.params.confirmationCode != user.confirmationCode)
      throw new CustomError("Invalid user", 401);
  }

  async signinUser(req, res, next) {
    const token = await signinUser(req.body);
    res.status(200).send(response("User signed in", token));
  }

  // async editUser(req, res, next) {
  //   const user = await editUser(req.params.userId, req.body);
  //   // const user = await User.findByIdAndUpdate(
  //   //   req.params.userId,
  //   //   {
  //   //     $set: req.body
  //   //   },
  //   //   { new: true }
  //   // );

  //   if (req.params.userId != req.headers.user.id)
  //     throw new CustomError("Invalid user", 401);
  //   res.status(200).send(response("Profile edited", user));
  // }
}

module.exports = new UserContoller();
