const router = require("express").Router();
const {
  signupUser,
  verifyUser,
  // signinUser,
} = require("../controllers/userController");
const { isUser, isActivated } = require("../middlewares/auth");

module.exports = function () {
  router.post("/signup", signupUser);
  router.get("/confirm/:confirmationCode", verifyUser);
  // router.post("/signin", isActivated, signinUser);

  // router.get("/", getUsers);
  // router.get("/:userId", getUser);
  // router.put("/:userId", isUser, editUser);
  // router.delete("/:userId", isUser, deleteUser);

  return router;
};
