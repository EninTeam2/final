const express = require("express");
const router = express.Router();
const requestStatus = require("../controllers/status");

module.exports = (app) => {
  router.get("/", requestStatus.getStatus);
  app.use("/status", router);
};
