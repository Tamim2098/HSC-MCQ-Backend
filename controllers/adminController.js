import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Question from '../models/Question.js';
import dotenv from 'dotenv'; 
import asyncHandler from 'express-async-handler';

dotenv.config();

const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;

if (!adminUsername || !adminPassword || !jwtSecret) {
  console.error("CRITICAL ERROR: Environment variables ADMIN_USERNAME, ADMIN_PASSWORD, or JWT_SECRET are not set.");
  process.exit(1); 
}

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '1h',
  });
};

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === adminUsername && password === adminPassword) {
      const token = generateToken(adminUsername);
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyToken = (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
};

// --- আপডেট করা addQuestion ফাংশন ---
export const addQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // এখানে explanation ফিল্ডটি যুক্ত করা হয়েছে
    const { subject, year, board, question, options, answer, image, explanation } = req.body;
    const newQuestion = new Question({
      subject,
      year,
      board,
      question,
      options,
      answer,
      image,
      explanation, // ডাটাবেসে সেভ করার জন্য
    });
    await newQuestion.save();
    res.status(201).json({ message: 'Question added successfully', question: newQuestion });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addQuestionsBulk = asyncHandler(async (req, res) => {
  const questions = req.body; 
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'Invalid input. Expected an array of questions.' });
  }

  // bulk ইনসার্টে req.body তে থাকা explanation অটোমেটিক ইনসার্ট হবে যদি মডেলে থাকে
  const insertedQuestions = await Question.insertMany(questions);

  res.status(201).json({ 
    message: `${insertedQuestions.length} questions added successfully`, 
    questions: insertedQuestions 
  });
});

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- আপডেট করা updateQuestion ফাংশন ---
export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  // এখানেও explanation ফিল্ডটি ডিস্ট্রাকচার করে নেওয়া হয়েছে
  const { subject, year, board, question, options, answer, image, explanation } = req.body;
  
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { subject, year, board, question, options, answer, image, explanation }, // আপডেট অবজেক্টে explanation যোগ করা হয়েছে
      { new: true, runValidators: true }
    );
    
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.status(200).json({ message: 'Question updated successfully', question: updatedQuestion });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};