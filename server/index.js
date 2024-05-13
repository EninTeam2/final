const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      name: "user",
      secure: false,
    },
  })
);

require("./router/auth")(app);
require("./router/customer")(app);
require("./router/role")(app);
require("./router/type")(app);
require("./router/unit")(app);
require("./router/user")(app);
require("./router/item")(app);
require("./router/status")(app);
require("./router/request")(app);
require("./router/request_ref")(app);
require("./router/sales")(app);
require("./router/sales_ref")(app);
require("./router/remain_price")(app);


app.listen(3000, () => {
  console.log("port listen...");
});
