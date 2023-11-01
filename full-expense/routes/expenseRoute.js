const express = require("express");
const router = express.Router();

const userAuthenticate = require("../middleware/auth");

const expenseController = require("../controllers/expenseController");

router.post(
  "/addExpense",
  userAuthenticate.authenticate,
  expenseController.addExpense
);

router.delete("/deleteExpense/:id", expenseController.deleteExpense);

router.get(
  "/displayItems",
  userAuthenticate.authenticate,
  expenseController.displayItems
);

router.get("/leaderBoard", expenseController.leaderBoard);

module.exports = router;
