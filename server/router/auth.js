const router = require("express").Router();
const auth = require("../controllers/auth");
module.exports = (app) => {
  router.post("/login", auth.login);
  router.get("/validity", auth.validity);
  router.get("/logout", auth.logout);
  app.use("/", router);
};
