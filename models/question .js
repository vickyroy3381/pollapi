// models/question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: String,
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
});

module.exports = mongoose.model('Question', questionSchema);
