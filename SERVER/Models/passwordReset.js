const mongoose = require('mongoose');

const PasswordResetRequestSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requestedAt: {
    type: Date,
    default: Date.now
  }
}, {
  _id: false  // because we’re providing our own _id
});

exports.Password = mongoose.model('PasswordResetRequest', PasswordResetRequestSchema);