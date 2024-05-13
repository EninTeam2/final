const express = require("express");
const router = express.Router();
const sales_ref = require("../controllers/sales_ref");
module.exports = (app) => {
  router.get("/", sales_ref.findAll);
  router.get("/read/:id", sales_ref.findOne);
  router.post("/add", sales_ref.create);
  router.put("/update/:id", sales_ref.update);
  router.delete("/delete/:id", sales_ref.delete);
  router.get("/all", sales_ref.alldate);
  app.use("/sales_ref", router);
};
