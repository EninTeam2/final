const express = require("express");
const router = express.Router();
const item = require("../controllers/item");
module.exports = (app) => {
  router.get("/", item.findAll);
  router.get("/read/:id", item.findOne);
  router.post("/add", item.create);
  router.put("/update/:id", item.update);
  router.delete("/delete/:id", item.delete);
  app.use("/item", router);
};
