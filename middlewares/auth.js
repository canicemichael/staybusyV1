const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function isUser(req, res, next) {
  const decoded = await jwt.verify(req.headers.authtoken, "healthie");

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

  if (user.status != "Active") {
    return res.status(401).send({
      message: "Pending Account. Please Verify Your Email!",
    });
  }
}

module.exports.isUser = isUser;
module.exports.isActivated = isActivated;
