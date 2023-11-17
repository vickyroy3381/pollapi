const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://vickyjsauth:PZxeE0vvWdbZn9fw@mymongodb.mecwaj1.mongodb.net/mymongodb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Define your models
const Question = require('./models/question');
const Option = require('./models/option');

// Routes
app.get('/', (req, res) => {
  // Implement your homepage view here
  res.render('index');
});

app.get('/questions/create', (req, res) => {
  res.render('createQuestion');
});

app.post('/questions/create', (req, res) => {
  const title = req.body.title;
  const options = req.body.options.split('\n').filter(option => option.trim() !== '');

  // Create a new question
  Question.create({ title }, (err, question) => {
    if (err) {
      console.error(err);
      res.redirect('/');
    } else {
      // Create options for the question
      Option.create(
        options.map(option => ({
          text: option,
          votes: 0,
          question: question._id,
        })),
        (err, options) => {
          if (err) {
            console.error(err);
          }
          res.redirect('/');
        }
      );
    }
  });
});

app.get('/questions/:id', (req, res) => {
  const questionId = req.params.id;
  Question.findById(questionId)
    .populate('options')
    .exec((err, question) => {
      if (err || !question) {
        console.error(err);
        res.redirect('/');
      } else {
        res.render('viewQuestion', { question });
      }
    });
});

app.post('/options/:id/add_vote', (req, res) => {
  const optionId = req.params.id;
  Option.findByIdAndUpdate(optionId, { $inc: { votes: 1 } }, (err, option) => {
    if (err) {
      console.error(err);
    }
    res.redirect(`/questions/${option.question}`);
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
