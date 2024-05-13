const express = require("express");
const router = express.Router();
const type = require("../controllers/type");
module.exports = (app) => {
  router.get("/", type.findAll);
  router.get("/read/:id", type.findOne);
  router.post("/add", type.create);
  router.put("/update/:id", type.update);
  router.delete("/delete/:id", type.delete);
  app.use("/type", router);
};
