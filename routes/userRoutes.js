const router = require("express").Router();
const {
  signupUser,
  verifyUser,
  signinUser,
  updateUserProfile,
} = require("../controllers/userController");
const { isUser, isActivated } = require("../middlewares/auth");

module.exports = function () {
  router.post("/signup", signupUser);
  router.get("/confirm/:confirmationCode", verifyUser);
  router.put("/:userId", updateUserProfile);
  router.post("/signin", signinUser);

  // router.get("/", getUsers);
  // router.get("/:userId", getUser);
  // router.delete("/:userId", isUser, deleteUser);

  return router;
};
