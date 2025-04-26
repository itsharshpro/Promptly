import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Chip,
  Avatar,
  Divider,
  TextField,
  Stack,
  CircularProgress,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import { 
  ArrowBack as BackIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Check as CheckIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api';
import { Question, Answer, User } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real implementation, we would fetch these from the API
        // For now, we'll use mock data
        
        // Mock question
        const mockQuestion: Question = {
          id: id || 'q1',
          question: 'Why does React re-render components when using useState?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'answered',
          response: {
            confidence: 0.95,
            answer: 'React re-renders components when state changes to ensure the UI reflects the current application state.\n\nWhen you call a state setter function like `setState` in React, the following happens:\n\n1. React schedules a re-render of the component\n2. During the re-render, React uses the new state value\n3. This ensures your UI stays in sync with the state\n\nThis is a core part of React\'s design philosophy called the "unidirectional data flow". Here\'s a simple example:\n\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}\n```\n\nEvery time you click the button, `setCount` is called, which triggers a re-render with the new count value.',
            escalate_to_human: false,
            tags: ['react', 'javascript', 'hooks'],
          }
        };
        
        // Mock user
        const mockUser: User = {
          id: 'user1',
          username: 'TechGuru',
          avatar: 'https://i.pravatar.cc/150?img=1',
        };
        
        // Mock answers
        const mockAnswers: Answer[] = [
          {
            id: 'a1',
            questionId: id || 'q1',
            userId: 'user2',
            answer: "This is a great question! To add a bit more detail to the AI answer - React's component re-rendering is essential but can sometimes lead to performance issues if not managed properly. If you find your app is re-rendering too frequently, consider using:\n\n- `React.memo` for functional components\n- `shouldComponentUpdate` for class components\n- `useMemo` and `useCallback` hooks to memoize values and functions\n\nHope this helps!",
            timestamp: new Date(Date.now() - 2400000).toISOString(),
            votes: 7,
            isAccepted: true
          },
          {
            id: 'a2',
            questionId: id || 'q1',
            userId: 'user3',
            answer: "One thing that's important to note is that calling a setState function doesn't immediately change the state value. State updates may be batched for performance reasons. This explains why reading state right after calling setState can give you the \"old\" value.\n\nAlso, if you need to update state based on the previous state, always use the functional form of setState:\n\n```jsx\nsetCount(prevCount => prevCount + 1);\n```\n\nThis ensures you're working with the most current state value.",
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            votes: 3,
            isAccepted: false
          }
        ];
        
        setQuestion(mockQuestion);
        setUser(mockUser);
        setAnswers(mockAnswers);
      } catch (error) {
        console.error('Error fetching question details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || !question) return;
    
    setSubmitting(true);
    try {
      // In a real implementation, we would call the API
      // const response = await apiService.postAnswer(question.id, 'user1', answerText);
      
      // Mock implementation
      const newAnswer: Answer = {
        id: `a${answers.length + 1}`,
        questionId: question.id,
        userId: 'user1',
        answer: answerText,
        timestamp: new Date().toISOString(),
        votes: 0,
        isAccepted: false
      };
      
      setAnswers([...answers, newAnswer]);
      setAnswerText('');
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = (answerId: string, isUpvote: boolean) => {
    setAnswers(answers.map(answer => {
      if (answer.id === answerId) {
        return {
          ...answer,
          votes: isUpvote ? answer.votes + 1 : answer.votes - 1
        };
      }
      return answer;
    }));
  };

  const handleAccept = (answerId: string) => {
    setAnswers(answers.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId
    })));
  };

  // Custom renderer for code blocks in markdown
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!question) {
    return (
      <Box sx={{ textAlign: 'center', my: 5 }}>
        <Typography variant="h5" color="error">Question not found</Typography>
        <Button 
          component={Link} 
          to="/questions" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Back to Questions
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          component={Link}
          to="/questions"
          startIcon={<BackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Questions
        </Button>
        
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.8), rgba(17, 23, 43, 0.9))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(66, 153, 225, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={user?.avatar || 'https://i.pravatar.cc/150?img=1'} 
              sx={{ 
                width: 40, 
                height: 40,
                mr: 2,
                border: '2px solid',
                borderColor: 'primary.main'
              }} 
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user?.username || 'Anonymous'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(question.timestamp).toLocaleString(undefined, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </Box>
          </Box>
          
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              fontFamily: '"Orbitron", sans-serif',
            }}
          >
            {question.question}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {question.response?.tags.map(tag => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            ))}
            <Chip 
              label={`Status: ${question.status.charAt(0).toUpperCase() + question.status.slice(1)}`}
              size="small"
              color={question.status === 'answered' ? 'success' : question.status === 'escalated' ? 'error' : 'warning'}
            />
          </Box>
          
          <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <Box 
            sx={{ 
              mb: 4, 
              p: 3, 
              borderRadius: 2, 
              backgroundColor: 'rgba(3, 233, 244, 0.05)',
              border: '1px solid rgba(3, 233, 244, 0.1)',
              position: 'relative'
            }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                fontFamily: '"Orbitron", sans-serif',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              AI Response
              <Chip 
                label={`${Math.round((question.response?.confidence || 0) * 100)}% Confidence`}
                size="small"
                color={(question.response?.confidence || 0) > 0.7 ? 'success' : 'warning'}
                sx={{ ml: 2, height: 24 }}
              />
            </Typography>
            
            <Box sx={{ fontFamily: '"Roboto", sans-serif' }}>
              <ReactMarkdown components={renderers}>
                {question.response?.answer || ''}
              </ReactMarkdown>
            </Box>
          </Box>
          
          {answers.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  fontFamily: '"Orbitron", sans-serif',
                }}
              >
                Community Answers ({answers.length})
              </Typography>
              
              {answers.map((answer) => (
                <motion.div
                  key={answer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    elevation={0}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      background: answer.isAccepted 
                        ? 'linear-gradient(145deg, rgba(20, 50, 48, 0.4), rgba(17, 43, 43, 0.5))'
                        : 'linear-gradient(145deg, rgba(20, 30, 48, 0.4), rgba(17, 23, 43, 0.5))',
                      backdropFilter: 'blur(10px)',
                      border: answer.isAccepted 
                        ? '1px solid rgba(76, 175, 80, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleVote(answer.id, true)}
                            size="small"
                          >
                            <ThumbUpIcon fontSize="small" />
                          </IconButton>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 'bold',
                              color: answer.votes > 0 
                                ? 'success.main' 
                                : answer.votes < 0 
                                  ? 'error.main' 
                                  : 'text.secondary'
                            }}
                          >
                            {answer.votes}
                          </Typography>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleVote(answer.id, false)}
                            size="small"
                          >
                            <ThumbDownIcon fontSize="small" />
                          </IconButton>
                          
                          {/* Accept answer button (only for question asker) */}
                          <IconButton 
                            color={answer.isAccepted ? "success" : "primary"} 
                            onClick={() => handleAccept(answer.id)}
                            size="small"
                            sx={{ 
                              mt: 1,
                              border: answer.isAccepted ? '1px solid' : 'none',
                              borderColor: 'success.main' 
                            }}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar 
                              src={`https://i.pravatar.cc/150?img=${answer.userId === 'user2' ? 2 : 3}`} 
                              sx={{ 
                                width: 32, 
                                height: 32,
                                mr: 1,
                                border: '1px solid',
                                borderColor: 'primary.main'
                              }} 
                            />
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
                              {answer.userId === 'user2' ? 'CodeMaster' : 'DevWizard'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(answer.timestamp).toLocaleString(undefined, { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                            {answer.isAccepted && (
                              <Chip 
                                label="Accepted" 
                                size="small" 
                                color="success"
                                sx={{ ml: 1, height: 24 }}
                              />
                            )}
                          </Box>
                          
                          <Box sx={{ fontFamily: '"Roboto", sans-serif' }}>
                            <ReactMarkdown components={renderers}>
                              {answer.answer}
                            </ReactMarkdown>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          )}
          
          <Box 
            component="form" 
            onSubmit={handleSubmitAnswer}
            sx={{ 
              mt: 4,
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.5), rgba(17, 23, 43, 0.6))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                fontFamily: '"Orbitron", sans-serif',
              }}
            >
              Your Answer
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={5}
              placeholder="Share your expertise here... (Markdown is supported)"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(17, 25, 40, 0.7)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 2,
                  border: '1px solid rgba(66, 153, 225, 0.2)',
                }
              }}
            />
            
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button 
                variant="contained" 
                color="primary"
                type="submit"
                disabled={!answerText.trim() || submitting}
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              >
                {submitting ? 'Submitting...' : 'Post Answer'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default QuestionPage; 