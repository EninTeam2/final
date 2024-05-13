const express = require("express");
const router = express.Router();
const unit = require("../controllers/unit");
module.exports = (app) => {
  router.get("/", unit.findAll);
  router.get("/read/:id", unit.findOne);
  router.post("/add", unit.create);
  router.put("/update/:id", unit.update);
  router.delete("/delete/:id", unit.delete);
  app.use("/unit", router);
};
