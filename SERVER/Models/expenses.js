const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  // Mongoose automatically adds an _id field
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative'] // Ensure amount is non-negative
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
    // Example categories, you might want to expand this enum or make it dynamic
    enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Travel', 'Rent', 'Health', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  // Using a single Date type is generally better for date-time queries in MongoDB
  // You can extract day, month, year in your application logic or with aggregation
  date: {
    type: String,
    required: [true, 'Please add a date']
  },
  // Keeping month and year separate as per your original schema, but as Numbers
  month: {
    type: String,
    required: [true, 'Please add a month'],
  },
  year: {
    type: Number,
    required: [true, 'Please add a year'],
  },
  userId: {
    type: mongoose.Schema.ObjectId, // Reference to the User model
    ref: 'User', // The name of the referenced model
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for efficient querying:
//ExpenseSchema.index({ userId: 1 }); // To quickly find all expenses for a user
/* ExpenseSchema.index({ date: -1 });  // To sort expenses by date (descending)
ExpenseSchema.index({ category: 1 }); // To filter by category
ExpenseSchema.index({ userId: 1, year: -1, month: -1 }); // For monthly/yearly reports per user */

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = { Expense };