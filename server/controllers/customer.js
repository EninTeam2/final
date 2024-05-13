const {
  models: { Customer },
} = require("../models");

exports.create = async (req, res) => {
  if (req.body.firstName && req.body.lastName && req.body.phone_no) {
    const { firstName, lastName, phone_no } = req.body;
    await Customer.create({
      firstName,
      lastName,
      phone_no,
    });
    res.json("Add Customer Compelted");
  } else {
    res.json("Can't to Add");
  }
};

exports.findAll = (req, res) => {
  Customer.findAll()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Customer.findByPk(id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Customer.update(req.body, { where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Customer.destroy({ where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
