const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    _id : {
    type: String, // Mongoose automatically adds an _id field
    default: () => new mongoose.Types.ObjectId() // Automatically generate a new ObjectId
    },
  paymentStatus: {
    type: Boolean,
    required: [true, 'Payment status is required'],
    default: false // Default to false (pending/failed)
  },
  userId: {
    type: mongoose.Schema.ObjectId, // Reference to the User model
    ref: 'User',
    required: true,
    unique: true 
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});


const Payments = mongoose.model('Payment', PaymentSchema);

module.exports = { Payments };