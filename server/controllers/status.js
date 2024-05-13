const {
  models: { Status },
} = require("../models");

exports.getStatus = async (req, res) => {
  try {
    const requests = await Status.findAll();
    res.json(requests);
  } catch (error) {
    console.error("Error fetching status");
    res.status(500).json({ error: "Error fetching status" });
  }
};
