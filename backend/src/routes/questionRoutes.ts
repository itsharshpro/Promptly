import { Router } from 'express';
import { askQuestion, getQuestions, getQuestionById } from '../controllers/questionController';

const router = Router();

// GET all questions
router.get('/', getQuestions);

// GET a question by ID
router.get('/:id', getQuestionById);

// POST a new question
router.post('/', askQuestion);

export default router; 