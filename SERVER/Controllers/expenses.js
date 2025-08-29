const mongoose = require("mongoose");
const { Expense } = require(`../Models/expenses`);
const { User } = require(`../Models/users`);
const { Parser } = require("json2csv");
const { getMonthFromNumber } = require(`../utils/helperFunctins`);

exports.getAllExpense = async (req, res) => {
  try {
    const userId = req.user._id; //changed

    const page = parseInt(req.query.page) || 1;
    const limitPointer = parseInt(req.query.limit) || 15;
    const skipPointer = (page - 1) * limitPointer;

    const allExpenseData = await Expense.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skipPointer)
      .limit(limitPointer);

    const totalProducts = await Expense.countDocuments({ userId });

    //calculating pagination metadata
    const totalPages = Math.ceil(totalProducts / limitPointer);

    res.status(200).json({
      success: true,
      data: allExpenseData,
      pagination: {
        currentPage: page,
        totalPage: totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log(`This is the error :${error}`);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, category, description, date } = req.body;

    const [year, month, day] = date.split("-");
    const monthName = getMonthFromNumber(month);

    const newExpense = new Expense({
      amount,
      category,
      description,
      date,
      month: monthName,
      year: parseInt(year),
      userId,
    });

    await newExpense.save();

    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalExpense: amount } },
    );

    res.status(201).json({
      success: true,
      data: newExpense,
    });
  } catch (error) {
    console.log(`This is the error :${error}`);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user._id;

    const { expenseId } = req.body;

    const expenseAmount = await Expense.findById(expenseId).select(
      "amount"
    );

    if (!expenseAmount) {
      return res.status(404).json({
        success: false,
        error: "Expense not found.",
      });
    }

    const amountToDecrement = expenseAmount.amount;

    const deletedExpense = await Expense.findByIdAndDelete(expenseId);

    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalExpense: Number(amountToDecrement) * -1 } },
    );

    res.status(200).json({
      success: true,
      data: deletedExpense,
    });
  } catch (error) {

    console.log(`This is the error :${error}`);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//all the expense for particular date
exports.getAllDayExpense = async (req, res) => {
  try {
    const userId = req.user.id; //changed
    const date = req.query.date;

    const allDayExpenses = await Expense.find({ userId, date });

    res.status(200).json({
      success: true,
      data: allDayExpenses,
    });
  } catch (error) {
    console.log(`This is the error :${error}`);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//all the expense for particular month
exports.getAllMonthExpense = async (req, res) => {
  try {
    const userId = req.user.id; //changed
    const month = req.query.month;

    const strMonth = getMonthFromNumber(parseInt(month.split("-").at(-1)));

    const allMonthExpenses = await Expense.find({
      userId: userId,
      month: strMonth,
    });

    res.status(200).json({
      success: true,
      data: allMonthExpenses,
    });
  } catch (error) {
    console.log(`This is the error :${error}`);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//all the expense for particular month
exports.getAllYearExpense = async (req, res) => {
  try {
    const userId = req.user._id; //changed
    const year = Number(req.query.year);

    const allYearExpenses = await Expense.aggregate([
      {
        $match: { userId, year },
      },
      {
        $group: {
          _id: "$month",
          amount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          amount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: allYearExpenses,
    });
  } catch (error) {
    console.log(`This is the error :${error}`);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.downloadDayExpenseCSV = async (req, res) => {
  try {
    const userId = req.user.id; //changed
    const date = req.query.date;

    const allDayExpenses = await Expense.find({ userId, date });

    if (allDayExpenses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No expenses found for the given criteria.",
      });
    }

    // Convert data to CSV
    const fields = ["date", "amount", "category", "description"]; // Define CSV columns
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(allDayExpenses);

    // Set headers to trigger file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=day-expenses-${date}.csv`
    );

    // Send CSV as response
    res.status(200).send(csv);
  } catch (error) {
    console.log(`This is the error :${error}`);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.downloadMonthExpenseCSV = async (req, res) => {
  try {
    const userId = req.user.id; //changed
    const month = req.query.month;

    console.log(month);
    const strMonth = getMonthFromNumber(parseInt(month.split("-").at(-1)));

    const allMonthExpenses = await Expense.find({ userId, month: strMonth });

    if (allMonthExpenses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No expenses found for the given criteria.",
      });
    }

    // Convert data to CSV
    const fields = ["date", "amount", "category", "description"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(allMonthExpenses);

    // Set headers to trigger file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=month-expenses-${month}.csv`
    );

    // Send CSV as response
    res.status(200).send(csv);
  } catch (error) {
    console.log(`This is the error :${error}`);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.downloadYearExpenseCSV = async (req, res) => {
  try {
    const userId = req.user._id; //changed
    const year = Number(req.query.year);

    const allYearExpenses = await Expense.aggregate([
      {
        $match: { userId, year },
      },
      {
        $group: {
          _id: "$month",
          amount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          amount: 1,
        },
      },
    ]);

    if (allYearExpenses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No expenses found for the given criteria.",
      });
    }

    // Convert data to CSV
    const fields = ["month", "amount"]; // Adjust fields based on grouped data
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(allYearExpenses);

    // Set headers to trigger file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=year-expenses-${year}.csv`
    );

    // Send CSV as response
    res.status(200).send(csv);
  } catch (error) {
    console.log(`This is the error :${error}`);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
