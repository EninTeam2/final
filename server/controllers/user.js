const {
  models: { User },
} = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.create = (req, res) => {
  if (req.body.user_name && req.body.password && req.body.roleId) {
    let { user_name, password, roleId } = req.body;
    roleId = -(-roleId);
    bcrypt.hash(password, saltRounds, function (err, hash) {
      password = hash;
      if (err) return res.json(err);
      User.create({
        user_name,
        password,
        roleId,
      });
      res.json({ user_name });
    });
  } else {
    res.json("Not added to the database!");
  }
};

exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
exports.update = (req, res) => {
  const id = req.params.id;
  let { user_name, password, roleId } = req.body;
  roleId = -(-roleId);
  bcrypt.hash(password, saltRounds, function (err, hash) {
    password = hash;
    console.log(user_name, password, roleId);
    if (err) return res.json(err);
    User.update({ user_name, password, roleId }, { where: { Id: id } })
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  });
};


exports.delete = (req, res) => {
  const id = req.params.id;
  console.log(id);
  User.destroy({ where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
