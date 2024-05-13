const controllers = {};

controllers.customer = require("./customer");
controllers.user = require("./user");
controllers.unit = require("./unit");
controllers.type = require("./type");
controllers.sales = require("./sales");
controllers.sales_ref = require("./sales_ref");
controllers.role = require("./role");
controllers.require = require("./require");
controllers.require_ref = require("./require_ref");
controllers.item = require("./item");
controllers.remain_price = require("./remain_price");
module.exports = controllers;
