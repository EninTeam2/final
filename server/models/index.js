const config = require("../config/config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.db.DATABASE,
  config.db.USER,
  config.db.PASSWORD,
  {
    host: config.db.HOST,
    dialect: config.db.dialect,
  }
);
const db = {};
db.sequelize = sequelize;

db.models = {};
db.models.User = require("./user")(sequelize, Sequelize.DataTypes);
db.models.Unit = require("./unit")(sequelize, Sequelize.DataTypes);
db.models.Customer = require("./customer")(sequelize, Sequelize.DataTypes);
db.models.Item = require("./item")(sequelize, Sequelize.DataTypes);
db.models.Request_ref = require("./request_ref")(
  sequelize,
  Sequelize.DataTypes
);
db.models.Request = require("./request")(sequelize, Sequelize.DataTypes);
db.models.Sales_ref = require("./sales_ref")(sequelize, Sequelize.DataTypes);
db.models.Sales = require("./sales")(sequelize, Sequelize.DataTypes);
db.models.Type = require("./type")(sequelize, Sequelize.DataTypes);
db.models.Role = require("./role")(sequelize, Sequelize.DataTypes);
db.models.Status = require("./status")(sequelize, Sequelize.DataTypes);
db.models.Remain_price = require("./remain_price")(
  sequelize,
  Sequelize.DataTypes
);

db.models.Status.hasMany(db.models.Remain_price, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.models.Remain_price.belongsTo(db.models.Status, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.models.Sales_ref.hasMany(db.models.Remain_price, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.models.Remain_price.belongsTo(db.models.Sales_ref, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.models.Role.hasMany(db.models.User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.User.belongsTo(db.models.Role, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.User.hasMany(db.models.Request, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Request.belongsTo(db.models.User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.User.hasMany(db.models.Sales, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Sales.belongsTo(db.models.User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Customer.hasMany(db.models.Request_ref, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Request_ref.belongsTo(db.models.Customer, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Customer.hasMany(db.models.Sales_ref, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Sales_ref.belongsTo(db.models.Customer, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Item.hasMany(db.models.Request, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Request.belongsTo(db.models.Item, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Item.hasMany(db.models.Sales, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Sales.belongsTo(db.models.Item, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Type.hasMany(db.models.Item, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Item.belongsTo(db.models.Type, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Unit.hasMany(db.models.Item, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Item.belongsTo(db.models.Unit, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Request_ref.hasOne(db.models.Sales_ref, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Sales_ref.belongsTo(db.models.Request_ref, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Sales_ref.hasMany(db.models.Sales, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Sales.belongsTo(db.models.Sales_ref, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Request_ref.hasMany(db.models.Request, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Request.belongsTo(db.models.Request_ref, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Status.hasMany(db.models.Request_ref, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Request_ref.belongsTo(db.models.Status, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Status.hasMany(db.models.Sales_ref, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Sales_ref.belongsTo(db.models.Status, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Status.hasMany(db.models.Request, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.models.Request.belongsTo(db.models.Status, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = db;
