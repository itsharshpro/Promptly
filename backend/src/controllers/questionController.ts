import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { processQuestion } from '../services/geminiService';
import { GeminiResponse, Question, QuestionRequest, TypedRequest } from '../types';

// In-memory storage for questions (would be replaced by a database in production)
const questions: Question[] = [];

/**
 * Ask a question to the AI
 */
export const askQuestion = async (req: TypedRequest<QuestionRequest>, res: Response) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log(`Received question: "${question}"`);
    
    try {
      // Process question through Gemini
      const aiResponse: GeminiResponse = await processQuestion(question);
      
      // Create new question record
      const newQuestion: Question = {
        id: uuidv4(),
        question,
        timestamp: new Date().toISOString(),
        status: aiResponse.escalate_to_human ? 'escalated' : 'answered',
        response: aiResponse
      };
      
      // Save question (to in-memory store for now)
      questions.push(newQuestion);
      
      // Return the AI response
      return res.status(200).json(aiResponse);
    } catch (aiError) {
      console.error('Error with AI processing:', aiError);
      
      // Create a graceful fallback response
      const fallbackResponse: GeminiResponse = {
        confidence: 0.3,
        answer: "I'm currently having trouble processing this question. It might be a technical issue or a complex question that would benefit from human expertise.",
        escalate_to_human: true,
        tags: ['system-error', 'needs-attention']
      };
      
      // Create new question record with fallback
      const newQuestion: Question = {
        id: uuidv4(),
        question,
        timestamp: new Date().toISOString(),
        status: 'escalated',
        response: fallbackResponse
      };
      
      // Save question
      questions.push(newQuestion);
      
      // Return the fallback response
      return res.status(200).json(fallbackResponse);
    }
  } catch (error) {
    console.error('Error processing question:', error);
    return res.status(500).json({ error: 'Failed to process question' });
  }
};

/**
 * Get all questions
 */
export const getQuestions = (req: Request, res: Response) => {
  return res.status(200).json(questions);
};

/**
 * Get a question by ID
 */
export const getQuestionById = (req: Request, res: Response) => {
  const { id } = req.params;
  const question = questions.find(q => q.id === id);
  
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  return res.status(200).json(question);
}; 