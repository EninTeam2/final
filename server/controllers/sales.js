const {
  models: { Sales },
} = require("../models");

exports.create = async (req, res) => {
  if (
    req.body.price &&
    req.body.itemId &&
    req.body.userId &&
    req.body.salesRefId
  ) {
    const { price, itemId, userId, salesRefId } = req.body;
    console.log(salesRefId);
    const newsale = await Sales.create({
      price,
      itemId,
      userId,
      salesRefId,
    });
    res.json({ message: "Sale entry created successfully", newsale });
  } else {
    res.json("Not added to the database!");
  }
};

exports.findAll = (req, res) => {
  Sales.findAll()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Sales.findByPk(id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Sales.update(req.body, { where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Sales.destroy({ where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
