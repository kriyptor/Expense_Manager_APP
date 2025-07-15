const express = require(`express`);
const expenseController = require(`../Controllers/expenses`);
const { authenticate } = require(`../middleware/auth`);
const router = express.Router();

// Specific routes
router.get('/user-expense',  authenticate,  expenseController.getAllExpense);
router.post('/add-expense',  authenticate,  expenseController.createExpense);
router.delete('/delete-expense',  authenticate,  expenseController.deleteExpense);

//download reports
router.get('/download-day-expense',  authenticate,  expenseController.downloadDayExpenseCSV);
router.get('/download-month-expense',  authenticate,  expenseController.downloadMonthExpenseCSV);
router.get('/download-year-expense',  authenticate,  expenseController.downloadYearExpenseCSV);

// More specific GET routes with full path
router.get('/user-expense/day',  authenticate,  expenseController.getAllDayExpense);
router.get('/user-expense/month',  authenticate,  expenseController.getAllMonthExpense);
router.get('/user-expense/year',  authenticate,  expenseController.getAllYearExpense);


module.exports = router;