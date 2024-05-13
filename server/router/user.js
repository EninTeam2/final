const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
module.exports = (app) => {
  router.get("/", user.findAll);
  router.get("/read/:id", user.findOne);
  router.post("/add", user.create);
  router.put("/update/:id", user.update);
  router.delete("/delete/:id", user.delete);
  app.use("/user", router);
};
