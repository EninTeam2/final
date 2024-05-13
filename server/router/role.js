const express = require("express");
const router = express.Router();
const role = require("../controllers/role");
module.exports = (app) => {
  router.get("/", role.findAll);
  router.get("/read/:id", role.findOne);
  router.post("/add", role.create);
  router.put("/update/:id", role.update);
  router.delete("/delete/:id", role.delete);
  app.use("/role", router);
};
