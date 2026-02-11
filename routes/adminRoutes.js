import express from 'express';
import { body } from 'express-validator';
import {
  adminLogin,
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  addQuestionsBulk, 
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

// --- আপডেট করা addQuestion Route ---
router.post(
  '/addQuestion',
  protect, 
  [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('question').notEmpty().withMessage('Question is required'),
    body('options').isArray({ min: 4, max: 4 }).withMessage('Options must be an array of 4 items'),
    body('answer').notEmpty().withMessage('Answer is required'),
    // explanation ঐচ্ছিক হলে ভ্যালিডেশন না দিলেও চলে, তবে টাইপ চেক রাখা ভালো
    body('explanation').optional().isString().withMessage('Explanation must be a string'),
  ],
  addQuestion
);


router.post('/add-questions-bulk', protect, addQuestionsBulk); 

router.get('/questions', protect, getQuestions); 

// --- আপডেট করা update-question Route ---
router.put(
  '/update-question/:id',
  protect, 
  [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('question').notEmpty().withMessage('Question is required'),
    body('options').isArray({ min: 4, max: 4 }).withMessage('Options must be an array of 4 items'),
    body('answer').notEmpty().withMessage('Answer is required'),
    // এখানেও explanation ফিল্ডটি যোগ করা হয়েছে
    body('explanation').optional().isString().withMessage('Explanation must be a string'),
  ],
  updateQuestion
);

router.delete('/delete-question/:id', protect, deleteQuestion); 

export default router;