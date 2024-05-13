const express = require("express");
const router = express.Router();
const request = require("../controllers/request");
module.exports = (app) => {
  router.get("/", request.findAll);
  router.get("/read/:id", request.findOne);
  router.post("/add", request.create);
  router.put("/update/:id", request.update);
  router.delete("/delete/:id", request.delete);
  app.use("/request", router);
};
