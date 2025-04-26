import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Chip,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Search as SearchIcon,
  LightbulbOutlined as LightbulbIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  QuestionAnswer as QuestionIcon,
  TrendingUp as TrendingIcon,
  ArrowRightAlt as ArrowIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  LooksOne as NumberOneIcon,
  LooksTwo as NumberTwoIcon,
  Looks3 as NumberThreeIcon,
  Looks4 as NumberFourIcon,
  Looks5 as NumberFiveIcon,
  Looks6 as NumberSixIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { LLMResponse } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const HomePage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<LLMResponse | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const featuredTopics = [
    'JavaScript', 'React', 'Python', 'Machine Learning', 
    'TypeScript', 'Node.js', 'CSS', 'SQL', 'Docker'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const result = await apiService.askQuestion(question);
      setResponse(result);
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = () => {
    // Navigate to questions list page
    navigate('/questions');
  };

  const handleNewQuestion = () => {
    setQuestion('');
    setResponse(null);
  };

  // Custom renderer for markdown elements with futuristic styling
  const renderers = {
    h1: ({ node, children, ...props }: any) => (
      <Typography 
        variant="h4" 
        component="h1" 
        {...props} 
        sx={{ 
          mb: 2, 
          mt: 3, 
          fontWeight: 600, 
          background: 'linear-gradient(90deg, #03e9f4, #6e42f5)',
          backgroundClip: 'text',
          color: 'transparent',
          display: 'inline-block',
          fontFamily: '"Orbitron", sans-serif',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -4,
            left: 0,
            width: '30%',
            height: 2,
            background: 'linear-gradient(90deg, #03e9f4, transparent)',
          }
        }}
      >
        {children}
      </Typography>
    ),
    h2: ({ node, children, ...props }: any) => (
      <Typography 
        variant="h5" 
        component="h2" 
        {...props} 
        sx={{ 
          mb: 2, 
          mt: 3, 
          fontWeight: 600, 
          color: '#03e9f4',
          fontFamily: '"Orbitron", sans-serif',
          position: 'relative',
          paddingLeft: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 4,
            height: '80%',
            background: 'linear-gradient(180deg, #03e9f4, transparent)',
            borderRadius: 4
          }
        }}
      >
        {children}
      </Typography>
    ),
    h3: ({ node, children, ...props }: any) => (
      <Typography 
        variant="h6" 
        component="h3" 
        {...props} 
        sx={{ 
          mb: 1.5, 
          mt: 2, 
          fontWeight: 500, 
          color: '#6e42f5',
          fontFamily: '"Orbitron", sans-serif' 
        }}
      >
        {children}
      </Typography>
    ),
    p: ({ node, children, ...props }: any) => {
      // Check if this paragraph is part of a list or standalone
      const parentIsLi = node?.parent?.tagName === 'li';
      if (parentIsLi) return <>{children}</>;
      
      // Check if paragraph starts with certain patterns to add special styling
      const paragraphText = children?.toString() || '';
      
      if (paragraphText.startsWith('Note:') || paragraphText.startsWith('Important:')) {
        return (
          <Box 
            sx={{ 
              mb: 2,
              p: 2,
              borderRadius: 1,
              backgroundColor: 'rgba(3, 233, 244, 0.1)',
              border: '1px solid rgba(3, 233, 244, 0.3)',
              position: 'relative',
              paddingLeft: 4
            }}
          >
            <InfoIcon 
              sx={{ 
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#03e9f4'
              }} 
            />
            <Typography variant="body1" {...props} sx={{ color: 'text.primary' }}>
              {children}
            </Typography>
          </Box>
        );
      }
      
      if (paragraphText.startsWith('Warning:') || paragraphText.startsWith('Caution:')) {
        return (
          <Box 
            sx={{ 
              mb: 2,
              p: 2,
              borderRadius: 1,
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              position: 'relative',
              paddingLeft: 4
            }}
          >
            <WarningIcon 
              sx={{ 
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#ff9800'
              }} 
            />
            <Typography variant="body1" {...props} sx={{ color: 'text.primary' }}>
              {children}
            </Typography>
          </Box>
        );
      }
      
      // Regular paragraph
      return (
        <Typography 
          variant="body1" 
          component="p" 
          {...props} 
          sx={{ 
            mb: 2,
            lineHeight: 1.7,
            color: 'text.primary'
          }}
        >
          {children}
        </Typography>
      );
    },
    ul: ({ node, children, ...props }: any) => (
      <Box 
        component="ul" 
        {...props} 
        sx={{ 
          pl: 0, 
          mb: 3,
          listStyleType: 'none'
        }}
      >
        {children}
      </Box>
    ),
    ol: ({ node, children, ...props }: any) => {
      // For ordered lists, we'll style them differently
      return (
        <Box 
          component="ol" 
          {...props} 
          sx={{ 
            pl: 0, 
            mb: 3,
            listStyleType: 'none',
            counterReset: 'step-counter'
          }}
        >
          {children}
        </Box>
      );
    },
    li: ({ node, children, ordered, ...props }: any) => {
      // Get the parent element type to determine if this is part of an ordered list
      const parentName = node?.parent?.tagName;
      const isOrdered = parentName === 'ol';
      
      // Get index for numbering in ordered lists
      const siblingIndex = node?.index || 0;
      
      // Choose icon based on ordered/unordered and index
      let icon;
      
      if (isOrdered) {
        const numberIcons = [
          <NumberOneIcon key="1" sx={{ color: '#03e9f4' }} />,
          <NumberTwoIcon key="2" sx={{ color: '#03e9f4' }} />,
          <NumberThreeIcon key="3" sx={{ color: '#03e9f4' }} />,
          <NumberFourIcon key="4" sx={{ color: '#03e9f4' }} />,
          <NumberFiveIcon key="5" sx={{ color: '#03e9f4' }} />,
          <NumberSixIcon key="6" sx={{ color: '#03e9f4' }} />
        ];
        icon = siblingIndex < 6 ? numberIcons[siblingIndex] : (
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: 'rgba(3, 233, 244, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#03e9f4',
              fontWeight: 'bold',
              fontSize: '0.8rem'
            }}
          >
            {siblingIndex + 1}
          </Box>
        );
      } else {
        icon = <ArrowIcon sx={{ color: '#03e9f4', transform: 'rotate(45deg)' }} />;
      }
      
      return (
        <ListItem 
          sx={{ 
            pl: 0, 
            pr: 0,
            py: 0.75,
            alignItems: 'flex-start'
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
            {icon}
          </ListItemIcon>
          <ListItemText 
            primary={
              <Box sx={{ color: 'text.primary' }}>
                {children}
              </Box>
            }
            sx={{ m: 0 }}
          />
        </ListItem>
      );
    },
    blockquote: ({ node, children, ...props }: any) => (
      <Box 
        {...props} 
        sx={{ 
          borderLeft: '3px solid #03e9f4',
          pl: 2,
          ml: 0,
          my: 2,
          py: 0.5,
          position: 'relative',
          '&::before': {
            content: '"""',
            position: 'absolute',
            left: -12,
            top: -10,
            fontFamily: 'Georgia, serif',
            fontSize: '2rem',
            color: '#03e9f4',
            opacity: 0.7
          },
          '&::after': {
            content: '"""',
            position: 'absolute',
            right: 0,
            bottom: -20,
            fontFamily: 'Georgia, serif',
            fontSize: '2rem',
            color: '#03e9f4',
            opacity: 0.7
          }
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            fontStyle: 'italic',
            color: 'text.secondary'
          }}
        >
          {children}
        </Typography>
      </Box>
    ),
    a: ({ node, children, href, ...props }: any) => (
      <Box 
        component="a" 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        {...props} 
        sx={{ 
          color: '#03e9f4',
          textDecoration: 'none',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -2,
            left: 0,
            width: '100%',
            height: 1,
            background: 'linear-gradient(90deg, #03e9f4, transparent)',
            transition: 'all 0.3s ease',
          },
          '&:hover': {
            textShadow: '0 0 8px rgba(3, 233, 244, 0.4)',
            '&::after': {
              height: 2,
            }
          }
        }}
      >
        {children}
      </Box>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      
      return !inline && match ? (
        <Box sx={{ mb: 3, mt: 3, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            px: 2, 
            py: 0.5,
            borderBottomLeftRadius: 8,
            fontSize: '0.75rem',
            color: '#03e9f4',
            fontFamily: '"Roboto Mono", monospace',
            letterSpacing: 1
          }}>
            {match[1].toUpperCase()}
          </Box>
          <SyntaxHighlighter
            style={atomDark}
            language={match[1]}
            PreTag="div"
            {...props}
            customStyle={{
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: 'rgba(20, 20, 30, 0.8)',
              border: '1px solid rgba(3, 233, 244, 0.2)',
              marginTop: 0,
              marginBottom: 0
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </Box>
      ) : (
        <Box 
          component="code" 
          className={className} 
          {...props}
          sx={{
            fontFamily: '"Roboto Mono", monospace',
            backgroundColor: 'rgba(3, 233, 244, 0.1)',
            padding: '2px 6px',
            borderRadius: 1,
            fontSize: '0.9rem',
            color: '#03e9f4',
            wordBreak: 'break-word'
          }}
        >
          {children}
        </Box>
      );
    },
    strong: ({ node, children, ...props }: any) => (
      <Box 
        component="strong" 
        {...props} 
        sx={{ 
          fontWeight: 'bold',
          color: '#03e9f4'
        }}
      >
        {children}
      </Box>
    ),
    em: ({ node, children, ...props }: any) => (
      <Box 
        component="em" 
        {...props} 
        sx={{ 
          fontStyle: 'italic',
          color: '#bb86fc'
        }}
      >
        {children}
      </Box>
    ),
    hr: () => (
      <Divider 
        sx={{ 
          my: 3,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #03e9f4, transparent)',
          border: 'none'
        }} 
      />
    ),
    img: ({ node, src, alt, ...props }: any) => (
      <Box
        sx={{
          my: 3,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: '1px solid rgba(3, 233, 244, 0.3)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 1
          }
        }}
      >
        <Box 
          component="img"
          src={src}
          alt={alt || ""}
          sx={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block'
          }}
          {...props}
        />
      </Box>
    )
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Box>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            padding: { xs: 4, md: 8 },
            mb: 6,
            background: 'linear-gradient(135deg, rgba(17, 25, 40, 0.95), rgba(28, 35, 60, 0.9))',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 0,
              opacity: 0.2,
              background: `url('/images/circuit-pattern.svg')`,
              backgroundSize: 'cover',
              pointerEvents: 'none'
            }}
          />
          
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h2" 
              component="h1" 
              align="center"
              sx={{ 
                mb: 2,
                fontWeight: 'bold',
                backgroundImage: 'linear-gradient(90deg, #03e9f4, #6e42f5)',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 20px rgba(3, 233, 244, 0.4)',
                letterSpacing: { xs: 0, md: 2 },
              }}
            >
              TechNexus AI
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary"
              sx={{ 
                mb: 4,
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 'light'
              }}
            >
              Get instant answers to your technical questions with our AI-powered assistant.
              Complex questions are escalated to our community of experts.
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{ 
                position: 'relative',
                maxWidth: '800px',
                mx: 'auto',
                mb: 3,
                zIndex: 1,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask a technical question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(17, 25, 40, 0.7)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 2,
                    border: '1px solid rgba(66, 153, 225, 0.2)',
                    '&:hover': {
                      borderColor: 'rgba(66, 153, 225, 0.4)',
                    },
                    '&.Mui-focused': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '16px',
                    fontSize: '1.1rem',
                  },
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: loading ? <CircularProgress size={24} color="primary" /> : null
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading || !question.trim()}
                sx={{
                  position: { xs: 'relative', sm: 'absolute' },
                  right: { xs: 0, sm: 8 },
                  top: { xs: 'auto', sm: '50%' },
                  transform: { xs: 'none', sm: 'translateY(-50%)' },
                  mt: { xs: 2, sm: 0 },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {loading ? 'Processing...' : 'Ask AI'}
              </Button>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'inline-block', mr: 1 }}>
                Popular topics:
              </Typography>
              <Box sx={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                {featuredTopics.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    size="small"
                    color="primary"
                    variant="outlined"
                    clickable
                    sx={{ 
                      backdropFilter: 'blur(4px)',
                      backgroundColor: 'rgba(3, 233, 244, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(3, 233, 244, 0.2)',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </motion.div>
        </Box>

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.95), rgba(17, 23, 43, 0.98))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(66, 153, 225, 0.08)',
              }}
            >
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontFamily: '"Orbitron", sans-serif' }}>AI Response</Typography>
                <Box>
                  <Chip 
                    label={`Confidence: ${Math.round(response.confidence * 100)}%`} 
                    size="small" 
                    color={response.confidence > 0.7 ? "success" : "warning"}
                    sx={{ mr: 1 }}
                  />
                  {response.tags.map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      color="secondary" 
                      variant="outlined" 
                      sx={{ mr: 1 }}
                    />
                  ))}
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Box sx={{ fontFamily: '"Roboto", sans-serif' }}>
                <ReactMarkdown components={renderers}>
                  {response.answer}
                </ReactMarkdown>
              </Box>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleNewQuestion}
                >
                  Ask New Question
                </Button>
                
                {response.escalate_to_human && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleEscalate}
                  >
                    Escalate to Human Experts
                  </Button>
                )}
                
                {!response.escalate_to_human && (
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleEscalate}
                  >
                    Not Satisfied? Ask Community
                  </Button>
                )}
              </Stack>
            </Paper>
          </motion.div>
        )}
        
        <motion.div variants={containerVariants}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: 4, 
              fontFamily: '"Orbitron", sans-serif',
              textAlign: 'center'
            }}
          >
            Why Use TechNexus?
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
            {[
              { 
                icon: <SpeedIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />, 
                title: 'Instant Answers', 
                description: 'Get immediate responses to your technical questions without waiting for community replies.'
              },
              { 
                icon: <PsychologyIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />, 
                title: 'AI-Powered Intelligence', 
                description: 'Our advanced AI can understand complex technical questions and provide accurate answers.'
              },
              { 
                icon: <QuestionIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />, 
                title: 'Community Expertise', 
                description: 'For complex questions, tap into our community of experienced developers and engineers.'
              },
              { 
                icon: <LightbulbIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />, 
                title: 'Smart Escalation', 
                description: 'Our system intelligently determines when a question needs human expertise.'
              },
            ].map((feature, index) => (
              <Box 
                key={index} 
                sx={{ 
                  width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(25% - 24px)' }
                }}
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' 
                  }}
                >
                  <Card 
                    sx={{ 
                      height: '100%',
                      background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.6), rgba(12, 18, 32, 0.8))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'rgba(3, 233, 244, 0.3)',
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        gutterBottom
                        sx={{ fontFamily: '"Orbitron", sans-serif' }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ mb: 6 }}>
            <Card
              sx={{
                p: 4,
                background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.9), rgba(17, 23, 43, 0.95))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(3, 233, 244, 0.1)',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                <Box sx={{ width: { xs: '100%', md: 'calc(58.33% - 16px)' }}}>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ fontFamily: '"Orbitron", sans-serif' }}
                  >
                    Trending Questions
                  </Typography>
                  <Typography variant="body1" paragraph>
                    See what the community is discussing right now. Browse through trending questions or contribute your expertise.
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    color="primary"
                    startIcon={<TrendingIcon />}
                    component="a"
                    href="/questions"
                    sx={{ mt: 1 }}
                  >
                    Browse Questions
                  </Button>
                </Box>
                <Box sx={{ width: { xs: '100%', md: 'calc(41.67% - 16px)' }}}>
                  <Box sx={{ p: 1 }}>
                    {['Why is my React useEffect hook firing twice?', 
                      'Best practices for Docker security in production', 
                      'TypeScript: How to properly type React props with generic components'].map((q, i) => (
                      <Box 
                        key={i}
                        sx={{ 
                          p: 2, 
                          mb: 2, 
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: 1,
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            cursor: 'pointer'
                          }
                        }}
                      >
                        <Typography variant="body2">{q}</Typography>
                        <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                          {['react', 'hooks', 'javascript', 'docker', 'typescript'][i % 3 === 0 ? 0 : i % 3 === 1 ? 3 : 4].split(',').map(tag => (
                            <Chip 
                              key={tag} 
                              label={tag} 
                              size="small" 
                              sx={{ 
                                height: 20, 
                                fontSize: '0.7rem',
                                backgroundColor: 'rgba(3, 233, 244, 0.1)',
                              }} 
                            />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default HomePage; 