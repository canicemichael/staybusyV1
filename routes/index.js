const router = require("express").Router();
const userRoutes = require("./userRoutes");
const completeProfile = require("./activatedUserRoutes");

module.exports = function (app) {
  router.get("/test", (req, res) => {
    res.send("yehh!");
  });

  router.use("/users", userRoutes());
  router.use("/profile", completeProfile());

  return router;
};
