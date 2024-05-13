const express = require("express");
const router = express.Router();
const remain_price = require("../controllers/remain_price");
module.exports = (app) => {
  router.get("/", remain_price.findAll);
  router.get("/read/:id", remain_price.findOne);
  router.post("/add", remain_price.create);
  app.use("/remain_price", router);
};
