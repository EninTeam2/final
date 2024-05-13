const express = require("express");
const router = express.Router();
const customer = require("../controllers/customer");
module.exports = (app) => {
  router.get("/", customer.findAll);
  router.get("/read/:id", customer.findOne);
  router.post("/add", customer.create);
  router.put("/update/:id", customer.update);
  router.delete("/delete/:id", customer.delete);
  app.use("/customer", router);
};
