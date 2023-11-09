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

router.get(
  "/download",
  userAuthenticate.authenticate,
  expenseController.downloadExpenses
);

router.get("/leaderBoard", expenseController.leaderBoard);

router.post(
  "/savelink",
  userAuthenticate.authenticate,
  expenseController.saveLink
);

router.get(
  "/reportData",
  userAuthenticate.authenticate,
  expenseController.reportData
);

module.exports = router;
