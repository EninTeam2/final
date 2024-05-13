const {
  models: { Sales_ref },
} = require("../models");

exports.create = async (req, res) => {
  const {
    totalprice,
    remainprice,
    statusId,
    comment,
    customerId,
    requestRefId,
  } = req.body;
  const date = new Date();

  try {
    const data = await Sales_ref.create({
      date,
      totalprice,
      statusId,
      remainprice,
      comment,
      customerId,
      requestRefId,
    });
    res.json({ message: "Sales reference created successfully", data });
  } catch (error) {
    res.json(error);
  }
};

exports.findAll = (req, res) => {
  Sales_ref.findAll()
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Sales_ref.findByPk(id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Sales_ref.update(req.body, { where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Sales_ref.destroy({ where: { Id: id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};
const date = new Date();
exports.alldate = (req, res) => {
  Sales_ref.findAll()
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
      
      for (let i = 6; i >= 0; i--) {
        const datevalue = new Date(
          new Date().setDate(new Date().getDate() - i)
        );
        data.map((datas) => {
          const newdate = new Date(datas.date);
          if (
            newdate.getDate() === datevalue.getDate() &&
            newdate.getMonth() === datevalue.getMonth() &&
            newdate.getFullYear() === datevalue.getFullYear()
          ) {
            newdata[2][i].push(datas);
          }
        });
      
      }

      res.json(newdata);
    })
    .catch((err) => console.log(err));
};
