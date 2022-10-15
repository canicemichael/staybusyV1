const {
  signupUser,
  signinUser,
  updateUserProfile,
  verifyUser,
} = require("../services/userServices");

const { response } = require("../helpers/messages");
const CustomError = require("../helpers/CustomError");
const { User, validateUser } = require("../models/user");
const ProfilePic = require("../models/profilePic");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
config = require("../config/auth.config");
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

class UserContoller {
  async signupUser(req, res, next) {
    const { error } = validateUser(req.body);

    let user = await User.findOne({ email: req.body.email });

    // const token = user.generateAuthToken();

    const token2 = await signupUser(req.body);

    res
      .header("x-auth-token", token2)
      .status(201)
      .send(response("Email Sent", token2));
  }

  async verifyUser(req, res, next) {
    const user = await verifyUser(req.params.confirmationCode);

    // if (req.params.confirmationCode != user.confirmationCode)
    //   throw new CustomError("Invalid user", 401);
    next();
  }

  async signinUser(req, res, next) {
    // const token = await signinUser(req.body);
    // res.status(200).send(response("User signed in", token));

    if (!req.body.email) throw new CustomError("No email specified");
    if (!req.body.password) throw new CustomError("No password");

    const user = await User.findOne({ email: req.body.email });

    if (!user) throw new CustomError("Incorrect email");

    if (user.status != "Active")
      throw new CustomError("Pending Account. Please Verify Your Email!", 401);

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    // if (!isCorrect) throw new CustomError("Incorrect email or password");

    const token = jwt.sign({ id: user._id }, config.secret); //role : "user"

    // return token;
    res
      .status(200)
      .header("x-auth-token", token)
      .send(response("User signed in", token));
  }

  async updateUserProfile(req, res, next) {
    const user = await updateUserProfile(req.params.userId, req.body);
    // const user = await User.findByIdAndUpdate(
    //   req.params.userId,
    //   {
    //     $set: req.body
    //   },
    //   { new: true }
    // );

    // if (req.params.userId != req.headers.user.id)
    //   throw new CustomError("Invalid user", 401);
    res.status(200).send(response("Profile edited", user));
  }

  async uploadDP(req, res, next) {
    //Setting storage engine
    const upload = multer({
      storage: Storage,
    }).single("testImage");

    upload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        const newProfile = new ProfilePic({
          name: req.body.name,
          image: {
            data: req.file.filename,
            contentType: "<image />png",
          },
        });
        newProfile
          .save()
          .then(() => res.send("successfully uploadeded"))
          .catch((err) => {
            console.log(err);
            res.send("err " + err);
          });
      }
    });
  }
}

module.exports = new UserContoller();
