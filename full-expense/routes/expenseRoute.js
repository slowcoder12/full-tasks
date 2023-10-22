const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expenseController');

router.post('/addExpense',expenseController.addExpense);

router.post('/deleteExpense/:id',expenseController.deleteExpense);

router.get('/displayItems',expenseController.displayItems);

module.exports = router;