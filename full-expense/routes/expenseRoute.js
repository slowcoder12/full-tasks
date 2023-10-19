const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expenseController');

router.post('/addExpense',expenseController.addExpense);

module.exports = router;