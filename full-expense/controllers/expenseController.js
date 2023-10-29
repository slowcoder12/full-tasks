const Expense = require("../models/expenseModel");
const jwt = require("jsonwebtoken");
const jwtSecret = "1234abc";
const sequelize = require("../util/database");
const User = require("../models/user");

exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  // const token = req.headers.authorization;
  // const decodedToken = jwt.verify(token, jwtSecret);

  // if (!decodedToken) {
  //   return res.status(401).json({ message: "Invalid token" });
  // }
  const userId = req.user.id;
  try {
    const result = await Expense.create({
      amount: amount,
      description: description,
      category: category,
      userId: userId,
    });

    console.log("Expense added");
    //console.log(result);
    res.status(200).json({ result, message: "expense added successfully" });
  } catch (err) {
    if (err) {
      console.log("error occured in adding", err);
    }
  }
};

exports.deleteExpense = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Expense.destroy({
      where: {
        id: id,
      },
    });

    if (result === 1) {
      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.displayItems = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    console.log(expenses);

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "err occured in displaying" });
  }
};

exports.leaderBoard = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      attributes: [
        "userId",
        [sequelize.fn("sum", sequelize.col("amount")), "totalExpense"],
      ],
      group: ["userId"],
      include: [{ model: User, attributes: ["name"] }],
      order: [[sequelize.literal("totalExpense"), "DESC"]],
    });

    res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
  }
};
