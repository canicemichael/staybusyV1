const { completeUserProfile } = require("../services/activatedUserService");

const { response } = require("../helpers/messages");
const CustomError = require("../helpers/CustomError");
const User = require("../models/user");

class UserContoller {
  async completeUserProfile(req, res, next) {
    const user = await completeUserProfile(req.params.userId, req.body);

    if (req.params.userId != req.headers.user.id)
      throw new CustomError("Invalid user", 401);

    res.status(200).send(response("Profile edited", user));
  }
}

module.exports = new UserContoller();
