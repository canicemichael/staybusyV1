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
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

class UserContoller {
  async signupUser(req, res, next) {
    const { error } = validateUser(req.body);

    const token = await signupUser(req.body);

    res.status(201).send(response("Email Sent", token));
  }

  async verifyUser(req, res, next) {
    const user = await verifyUser(req.params.confirmationCode);

    if (req.params.confirmationCode != user.confirmationCode)
      throw new CustomError("Invalid user", 401);
  }

  async signinUser(req, res, next) {
    const token = await signinUser(req.body);
    res.status(200).send(response("User signed in", token));
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

    if (req.params.userId != req.headers.user.id)
      throw new CustomError("Invalid user", 401);
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
          .then(() => res.send("successfully uploadede"))
          .catch((err) => {
            console.log(err);
            res.send("err " + err);
          });
      }
    });
  }
}

module.exports = new UserContoller();
