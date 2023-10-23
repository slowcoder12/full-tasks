const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./util/database");

const userRoute = require("./routes/userRoute");
const expRoute = require("./routes/expenseRoute");
const User = require("./models/user");
const Expense = require("./models/expenseModel");

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.post("/signup", userRoute);

app.post("/login", userRoute);

app.post("/addExpense", expRoute);

app.post("/deleteExpense/:id", expRoute);

app.get("/displayItems", expRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
