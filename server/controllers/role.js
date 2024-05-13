const {
   models: { Role },
 } = require("../models");


 exports.create = async (req, res) => {
   if (req.body.roleName) {
     const { roleName } = req.body;
     console.log(roleName);
     await Role.create({
       roleName,
     });
     res.json({ roleName });
   } else {
     res.json("Not added to the database!");
   }
 };

 exports.findAll = (req, res) => {
   Role.findAll()
     .then((data) => res.json(data))
     .catch((err) => console.log(err));
 };

 exports.findOne = (req, res) => {
   const id = req.params.id;
   Role.findByPk(id)
     .then((data) => res.json(data))
     .catch((err) => res.json(err));
 };

 exports.update = (req, res) => {
   const id = req.params.id;
   Role.update(req.body, { where: { Id: id } })
     .then((data) => res.json(data))
     .catch((err) => res.json(err));
 };

 exports.delete = (req, res) => {
   const id = req.params.id;
   console.log(id);
   Role.destroy({ where: { Id: id } })
     .then((data) => res.json(data))
     .catch((err) => res.json(err));
 };
