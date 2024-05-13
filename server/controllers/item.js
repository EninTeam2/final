const {
  models: { Item },
} = require("../models");

exports.create = async (req, res) => {
  if (
    req.body.itemName &&
    req.body.price &&
    req.body.typeId &&
    req.body.unitId
  ) {
    const { itemName, price, typeId, unitId } = req.body;
    console.log(itemName);
    await Item.create({
      itemName,
      price,
      typeId,
      unitId,
    });
    res.json({ itemName });
  } else {
    res.json("Not added to the database!");
  }
};

exports.findAll = (req, res) => {
  Item.findAll()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Item.findByPk(id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Item.update(req.body, { where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Item.destroy({ where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
