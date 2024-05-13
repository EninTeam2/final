const express = require("express");
const router = express.Router();
const request_ref = require("../controllers/request_ref");
module.exports = (app) => {
  router.get("/", request_ref.findAll);
  router.get("/read/:id", request_ref.findOne);
  router.post("/add", request_ref.create);
  router.put("/update/:id", request_ref.update);
  router.delete("/delete/:id", request_ref.delete);
  router.get("/sort", request_ref.findAllSort);
  router.get("/all", request_ref.alldate);
  app.use("/request_ref", router);
};
