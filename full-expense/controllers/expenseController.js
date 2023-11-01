const Expense = require("../models/expenseModel");
const sequelize = require("../util/database");
const User = require("../models/user");

exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  const { amount, description, category } = req.body;
  const userId = req.user.id;
  try {
    const result = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: userId,
      },
      { transaction: t }
    );
    const user = await User.findByPk(userId, { transaction: t });
    if (user) {
      user.totalExpense += parseInt(amount);
      await user.save({ transaction: t });
    }
    await t.commit();
    console.log("Expense added");
    //console.log(result);
    res.status(200).json({ result, message: "expense added successfully" });
  } catch (err) {
    await t.rollback();
    console.log("error occured in adding", err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.deleteExpense = async (req, res) => {
  const id = req.params.id;
  try {
    const expense = await Expense.findOne({
      where: {
        id: id,
      },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const userId = expense.userId;
    const amount = expense.amount;

    const result = await Expense.destroy({
      where: {
        id: id,
      },
    });

    if (result === 1) {
      const user = await User.findByPk(userId);
      if (user) {
        user.totalExpense -= user.totalExpense - amount;
        await user.save();
      }

      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.status(500).json({ message: "An error occurred" });
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
    const expenses = await User.findAll({
      attributes: ["name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });
    res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
  }
};
