import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Chip,
  List,
  ListItem,
  Divider,
  InputAdornment,
  Tab,
  Tabs,
  Avatar,
  Stack,
  Badge,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingIcon,
  AccessTime as NewestIcon,
  StarOutline as UnansweredIcon,
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
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import { Question, User } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QuestionsListPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<Record<string, User>>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await apiService.getQuestions();
        setQuestions(fetchedQuestions as Question[]);
        
        // Get unique user IDs to fetch
        const uniqueUserIds = ['user1', 'user2', 'user3']; // In a real app, extract from questions
        
        // Fetch user data
        const usersData: Record<string, User> = {};
        for (const userId of uniqueUserIds) {
          const user = await apiService.getUser(userId) as User;
          if (user) {
            usersData[userId] = user;
          }
        }
        
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    
    fetchQuestions();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Mock data for demonstration
  const mockQuestions: Question[] = [
    {
      id: 'q1',
      question: 'Why does React re-render components when using useState?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'answered',
      response: {
        confidence: 0.95,
        answer: 'React re-renders components when state changes to ensure the UI reflects the current application state. This is a core part of React\'s design philosophy.',
        escalate_to_human: false,
        tags: ['react', 'javascript', 'hooks']
      }
    },
    {
      id: 'q2',
      question: 'What\'s the difference between useMemo and useCallback in React?',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'answered',
      response: {
        confidence: 0.92,
        answer: 'useMemo caches the result of a computation, while useCallback caches a function definition. Both are used for performance optimization.',
        escalate_to_human: false,
        tags: ['react', 'hooks', 'performance']
      }
    },
    {
      id: 'q3',
      question: 'My Docker container keeps crashing with OOMKilled error. How can I debug this?',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'escalated',
      response: {
        confidence: 0.45,
        answer: 'This appears to be a memory-related issue in your Docker container. You might want to check for memory leaks or increase the container memory limit.',
        escalate_to_human: true,
        tags: ['docker', 'devops', 'debugging']
      }
    },
    {
      id: 'q4',
      question: 'Best practices for implementing authentication in a Node.js/Express API?',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'escalated',
      response: {
        confidence: 0.65,
        answer: 'For Node.js/Express authentication, consider using JWT, OAuth, or Passport.js. Implement HTTPS, secure cookies, and proper password hashing.',
        escalate_to_human: true,
        tags: ['node.js', 'express', 'authentication', 'security']
      }
    },
    {
      id: 'q5',
      question: 'How to optimize database queries in a large-scale PostgreSQL application?',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      status: 'answered',
      response: {
        confidence: 0.88,
        answer: 'For PostgreSQL optimization: use proper indexing, analyze query plans with EXPLAIN, optimize JOINs, use connection pooling, and consider query caching.',
        escalate_to_human: false,
        tags: ['postgresql', 'database', 'performance']
      }
    }
  ];

  const displayQuestions = questions.length > 0 ? questions : mockQuestions;
  const filteredQuestions = displayQuestions.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (q.response?.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (tabValue) {
      case 0: // Trending
        return a.id.localeCompare(b.id); // In a real app, sort by a trending metric
      case 1: // Newest
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 2: // Unanswered/Escalated
        return a.status === 'escalated' ? -1 : 1;
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
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
    li: ({ node, children, ...props }: any) => {
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
    )
  };

  return (
    <Box>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              mb: 3,
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 600
            }}
          >
            Community Questions
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 4,
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.7), rgba(17, 23, 43, 0.8))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(66, 153, 225, 0.08)',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 2
            }}
          >
            <TextField
              placeholder="Search questions by topic, keywords, or tags..."
              fullWidth
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(17, 25, 40, 0.7)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 2,
                  border: '1px solid rgba(66, 153, 225, 0.2)',
                }
              }}
            />
            <Button 
              variant="contained" 
              startIcon={<FilterIcon />}
              sx={{ 
                whiteSpace: 'nowrap',
                minWidth: '120px'
              }}
            >
              Filters
            </Button>
            <Button 
              component={Link}
              to="/"
              variant="outlined" 
              color="primary"
              sx={{ 
                whiteSpace: 'nowrap',
                minWidth: '180px'
              }}
            >
              Ask New Question
            </Button>
          </Paper>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.7), rgba(17, 23, 43, 0.8))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(66, 153, 225, 0.08)',
              overflow: 'hidden'
            }}
          >
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ 
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  height: 3,
                  boxShadow: '0 0 5px #03e9f4',
                },
                '& .MuiTab-root': {
                  py: 2,
                  fontWeight: 500
                }
              }}
            >
              <Tab icon={<TrendingIcon />} label="Trending" />
              <Tab icon={<NewestIcon />} label="Newest" />
              <Tab 
                icon={<Badge badgeContent={mockQuestions.filter(q => q.status === 'escalated').length} color="error"><UnansweredIcon /></Badge>} 
                label="Escalated" 
              />
            </Tabs>

            <List sx={{ p: 0 }}>
              {sortedQuestions.map((question, index) => (
                <React.Fragment key={question.id}>
                  {index > 0 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />}
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <ListItem 
                      alignItems="flex-start"
                      component={Link}
                      to={`/questions/${question.id}`}
                      sx={{ 
                        textDecoration: 'none',
                        color: 'inherit',
                        p: 3
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Stack 
                          direction="row" 
                          spacing={2} 
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Avatar 
                            src={users['user' + (index % 3 + 1)]?.avatar || `https://i.pravatar.cc/150?img=${index + 1}`}
                            sx={{ 
                              width: 32, 
                              height: 32,
                              border: '1px solid',
                              borderColor: 'primary.main'
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {users['user' + (index % 3 + 1)]?.username || 'Anonymous'} • {new Date(question.timestamp).toLocaleString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          {question.status === 'escalated' && (
                            <Chip 
                              label="Escalated" 
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ height: 24 }}
                            />
                          )}
                        </Stack>

                        <Typography 
                          variant="h6" 
                          component="div"
                          sx={{ 
                            mb: 1.5,
                            fontWeight: 500
                          }}
                        >
                          {question.question}
                        </Typography>

                        {question.response && (
                          <Box 
                            component="div" 
                            sx={{ 
                              mb: 2,
                              display: '-webkit-box',
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2,
                              color: 'text.secondary',
                              fontSize: '0.875rem',
                              lineHeight: 1.43,
                              '& p': { margin: 0 },
                              '& ul, & ol': { margin: 0, paddingLeft: 2 },
                              '& code': {
                                fontFamily: 'monospace',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                padding: '2px 4px',
                                borderRadius: 1,
                                fontSize: '0.8125rem',
                              }
                            }}
                          >
                            <ReactMarkdown components={renderers}>
                              {question.response.answer}
                            </ReactMarkdown>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {question.response?.tags.map(tag => (
                            <Chip 
                              key={tag} 
                              label={tag} 
                              size="small"
                              sx={{ 
                                height: 24,
                                backgroundColor: 'rgba(3, 233, 244, 0.1)',
                                '&:hover': {
                                  backgroundColor: 'rgba(3, 233, 244, 0.2)',
                                }
                              }}
                            />
                          ))}
                          {question.response && (
                            <Chip 
                              label={`${Math.round(question.response.confidence * 100)}% Confidence`}
                              size="small"
                              color={question.response.confidence > 0.7 ? "success" : "warning"}
                              variant="outlined"
                              sx={{ height: 24 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </ListItem>
                  </motion.div>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default QuestionsListPage; 