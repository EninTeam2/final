const {
  models: { Unit },
} = require("../models");

exports.create = async (req, res) => {
  if (req.body.unitName) {
    const { unitName } = req.body;
    console.log(unitName);
    await Unit.create({
      unitName,
    });
    res.json({ unitName });
  } else {
    res.json("Not added to the database!");
  }
};

exports.findAll = (req, res) => {
  Unit.findAll()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Unit.findByPk(id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Unit.update(req.body, { where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Unit.destroy({ where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
