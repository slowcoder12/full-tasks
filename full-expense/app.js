const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./util/database");

const userRoute = require("./routes/userRoute");
const expRoute = require("./routes/expenseRoute");
const purchaseRoute = require("./routes/purchaseRoute");
const passwordRoute = require("./routes/passwordRoute");
const reportRoute = require("./routes/reportRoute");
const User = require("./models/user");
const Expense = require("./models/expenseModel");
const Orders = require("./models/orders");
const forgotPasswordReq = require("./models/forgotPassword");
const fileDownloads = require("./models/fileDownloads");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.post("/signup", userRoute);

app.post("/login", userRoute);

app.post("/addExpense", expRoute);

app.delete("/deleteExpense/:id", expRoute);

app.get("/displayItems", expRoute);
app.get("/leaderBoard", expRoute);

app.post("/buyPremium", purchaseRoute);

app.post("/updateTransactionStatus", purchaseRoute);

app.get("/checkPremium", purchaseRoute);

app.post("/forgotPassword", passwordRoute);

app.get("/resetPassword/:requestId", passwordRoute);

app.post("/updatePassword/:requestId", passwordRoute);
app.get("/displayEItems", reportRoute);

app.get("/download", reportRoute);

app.post("/savelink", reportRoute);

app.get("/reportData", reportRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Orders);
Orders.belongsTo(User);

User.hasMany(forgotPasswordReq);
User.hasMany(fileDownloads);

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
