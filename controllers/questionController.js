import Question from '../models/Question.js';

export const getAllQuestions = async (req, res) => {
  try {
    const { subject, year, board } = req.query;
    const filter = {};

    // ফিল্টার অবজেক্ট তৈরি করা
    if (subject) filter.subject = subject;
    if (year) filter.year = year;
    if (board) filter.board = board;

    // ডাটাবেস থেকে প্রশ্নগুলো খুঁজে বের করা
    // এখানে model-এ explanation যোগ করার ফলে সেটিও questions এর সাথে চলে আসবে
    const questions = await Question.find(filter);

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};