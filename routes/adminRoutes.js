import express from 'express';
import { body } from 'express-validator';
import {
  adminLogin,
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  adminLogin
);

router.post('/verify-token', protect, (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
});

router.post(
  '/addQuestion',
  protect, 
  [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('question').notEmpty().withMessage('Question is required'),
    body('options').isArray({ min: 4, max: 4 }).withMessage('Options must be an array of 4 items'),
    body('answer').notEmpty().withMessage('Answer is required'),
  ],
  addQuestion
);

router.get('/questions', protect, getQuestions); 

router.put(
  '/update-question/:id',
  protect, 
  [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('question').notEmpty().withMessage('Question is required'),
    body('options').isArray({ min: 4, max: 4 }).withMessage('Options must be an array of 4 items'),
    body('answer').notEmpty().withMessage('Answer is required'),
  ],
  updateQuestion
);

router.delete('/delete-question/:id', protect, deleteQuestion); 

export default router;