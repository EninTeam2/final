const {
  models: { Request },
} = require("../models");

exports.create = async (req, res) => {
  if (req.body.price && req.body.itemId && req.body.userId) {
    const { price, itemId, userId, requestRefId } = req.body;
    const statusId = 4;
    await Request.create({
      price,
      itemId,
      userId,
      requestRefId,
      statusId,
    });
    res.json({ price });
  } else {
    res.json("Not added to the database!");
  }
};

exports.findAll = (req, res) => {
  Request.findAll()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Request.findByPk(id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Request.update(req.body, { where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Request.destroy({ where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
