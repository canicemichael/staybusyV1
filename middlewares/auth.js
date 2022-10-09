const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/auth.config");

async function isUser(req, res, next) {
  const decoded = await jwt.verify(req.headers.authtoken, config.secret);

  const user = await User.findOne({ _id: decoded.id });

  if (!user) throw new CustomError("User dosen't exist");

  if (decoded.role == "user") {
    req.headers.user = decoded;
    next();
  } else {
    throw new CustomError("Unauthorized user", 401);
  }
}

async function isActivated(req, res, next) {
  const user = await User.findOne({ _id: decoded.id });

  if (user.status != "Active")
    throw new CustomError("Pending Account. Please Verify Your Email!", 401);
}

module.exports.isUser = isUser;
module.exports.isActivated = isActivated;
