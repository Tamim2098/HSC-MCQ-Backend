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
  },
  // এই ফিল্ডটি ডাটাবেসে ব্যাখ্যা সেভ করার জন্য অবশ্যই থাকতে হবে
  explanation: {
    type: String,
    default: ""
  }
}, { timestamps: true }); // এটি যোগ করলে ডাটা কখন তৈরি বা আপডেট হয়েছে তা জানা যাবে

const Question = mongoose.model('questions', questionSchema);

export default Question;