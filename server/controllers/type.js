const {
  models: { Type },
} = require("../models");

exports.create = async (req, res) => {
  if (req.body.typeName) {
    const { typeName } = req.body;
    console.log(typeName);
    await Type.create({
      typeName,
    });
    res.json({ typeName });
  } else {
    res.json("Not added to the database!");
  }
};

exports.findAll = (req, res) => {
  Type.findAll()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Type.findByPk(id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Type.update(req.body, { where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Type.destroy({ where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
