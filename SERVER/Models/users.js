const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Mongoose automatically adds an _id field as the primary key
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true, // Ensures email is unique across all users
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Do not return password in queries by default for security
  },
  totalExpense: {
    type: Number,
    required: true,
    default: 0 // Initialize total expense to 0
  },
  premiumUser: {
    type: Boolean,
    required: true,
    default: false // Default to false
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };