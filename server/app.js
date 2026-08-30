const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const careerRoutes = require('./routes/careerRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('Career Route API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/resume-improvement', require('./routes/resumeImprovementRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

module.exports = app;
