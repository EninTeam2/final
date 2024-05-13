const {
  models: { Remain_price },
} = require("../models");

exports.create = async (req, res) => {
  const { remainprice, paidprice, statusId, salesRefId } = req.body;
  const date = new Date();

  try {
    const data = await Remain_price.create({
      date,
      remainprice,
      paidprice,
      statusId,
      salesRefId,
    });
    res.json({ message: "Remain Price created successfully", data });
  } catch (error) {
    res.json(error);
  }
};
exports.findAll = (req, res) => {
  Remain_price.findAll()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Remain_price.findByPk(id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
