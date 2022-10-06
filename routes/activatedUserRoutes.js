const router = require("express").Router();
const {
  completeUserProfile,
} = require("../controllers/activatedUserController");
const { isUser, isActivated } = require("../middlewares/auth");

module.exports = function () {
  router.post("/completeUserProfile/:userId", isUser, completeUserProfile);

  return router;
};
