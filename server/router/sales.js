const express = require("express");
const router = express.Router();
const sales = require("../controllers/sales");
module.exports = (app) => {
  router.get("/", sales.findAll);
  router.get("/read/:id", sales.findOne);
  router.post("/add", sales.create);
  router.put("/update/:id", sales.update);
  router.delete("/delete/:id", sales.delete);
  app.use("/sales", router);
};
