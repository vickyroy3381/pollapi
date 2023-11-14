// models/option.js
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  votes: Number,
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
});

module.exports = mongoose.model('Option', optionSchema);
