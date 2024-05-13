const {
  models: { Request_ref },
} = require("../models");
const date = new Date();
exports.create = async (req, res) => {
  const { totalprice, statusId, customerId } = req.body;
  const date = new Date();
  const comment = "This is comment";
  console.log(customerId);
  await Request_ref.create({
    date,
    totalprice,
    customerId,
    statusId,
    comment,
  })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.findAll = (req, res) => {
  Request_ref.findAll()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Request_ref.findByPk(id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Request_ref.update(req.body, { where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Request_ref.destroy({ where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
exports.findAllSort = (req, res) => {
  Request_ref.findAll({ order: [["date", "DESC"]] })
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.alldate = (req, res) => {
  Request_ref.findAll()
    .then((data) => {
      let newdata = [
        [[], [], [], [], [], [], [], [], [], [], [], []],
        [[], [], [], []],
        [[], [], [], [], [], [], []],
      ];

      for (let i = 0; i < 12; i++) {
        data.map((datas) => {
          const newdate = new Date(datas.date);
          if (newdate.getFullYear() === date.getFullYear()) {
            if (i === newdate.getMonth() && i <= date.getMonth()) {
              newdata[0][i].push(datas);
            }
          }
        });
      }
      let result = false,
        count = 4;
      for (let i = 27; i >= 0; i--) {
        const datevalue = new Date(
          new Date().setDate(new Date().getDate() - i)
        );
        if (datevalue.getDay() === 0) {
          result = true;
          count -= 1;
        }
        if (result) {
          data.map((datas) => {
            const newdate = new Date(datas.date);
            if (
              newdate.getDate() === datevalue.getDate() &&
              newdate.getMonth() === datevalue.getMonth() &&
              newdate.getFullYear() === datevalue.getFullYear()
            ) {
              newdata[1][count].push(datas);
            }
          });
        }
      }
      result = false;
      count = 0;
      for (let i = 6; i >= 0; i--) {
        const datevalue = new Date(
          new Date().setDate(new Date().getDate() - i)
        );
        if (datevalue.getDay() === 0) {
          result = true;
        }
        if (result) {
          data.map((datas) => {
            const newdate = new Date(datas.date);
            if (
              newdate.getDate() === datevalue.getDate() &&
              newdate.getMonth() === datevalue.getMonth() &&
              newdate.getFullYear() === datevalue.getFullYear()
            ) {
              newdata[2][count].push(datas);
            }
          });
          count += 1;
        }
      }

      res.json(newdata);
    })
    .catch((err) => console.log(err));
};
