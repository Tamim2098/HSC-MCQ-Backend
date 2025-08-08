import Question from '../models/Question.js';

export const getAllQuestions = async (req, res) => {
  try {
    const { subject, year, board } = req.query;
    const filter = {};

    if (subject) filter.subject = subject;
    if (year) filter.year = year;
    if (board) filter.board = board;

    const questions = await Question.find(filter);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
