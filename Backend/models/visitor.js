// visitor.js
const mongoose = require('mongoose');

// Define the Visitor Schema for anonymous or logged-in visitors
const VisitorSchema = new mongoose.Schema({
  ip: String,
  browser: String,
  deviceType: String,
  timeSpent: Number,
  totalClicks: Number,
  navigationHistory: String,
  visitTime: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } // Optional: If logged in, link to user
});

const Visitor = mongoose.model('Visitor', VisitorSchema);

module.exports = Visitor; // Correct export
