const {
  models: { User },
} = require("../models");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {
  if (req.body.user_name && req.body.password) {
    let { user_name, password } = req.body;
    User.findOne({ where: { user_name: user_name } })
      .then((data) => {
        const role = ["admin", "admin", "worker"];
        if (data) {
          bcrypt.compare(password, data.password, function (err, result) {
            if (err) return res.json(err);
            if (result) {
              req.session.user = { Id: data.Id, roleId: data.roleId };
              return res.json({
                Login: true,
                role: role[Number(data.roleId) - 1],
              });
            } else {
              return res.json({ Login: false });
            }
          });
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.json("Incorrect Input!!!");
  }
};
exports.validity = (req, res) => {
  const user = { roleId: 0 };
  try {
    if (!req.session.user) return res.json(user);
    res.json(req.session.user);
  } catch (error) {
    console.log(error);
  }
};
exports.logout = (req, res) => {
  try {
    req.session.destroy(function (err) {
      if (err) {
        return res.json("Can't Logout Work");
      }
    });
    res.clearCookie("connect.sid", { path: "/" });
    res.json("Deleted Session");
  } catch (error) {
    console.log(error);
  }
};
