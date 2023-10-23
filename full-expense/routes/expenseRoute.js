const express = require("express");
const router = express.Router();

const userAuthenticate = require("../middleware/auth");

const expenseController = require("../controllers/expenseController");

router.post("/addExpense", expenseController.addExpense);

router.post("/deleteExpense/:id", expenseController.deleteExpense);

router.get(
  "/displayItems",
  userAuthenticate.authenticate,
  expenseController.displayItems
);

module.exports = router;
