import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  board: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  }
});

const Question = mongoose.model('questions', questionSchema);

export default Question;
