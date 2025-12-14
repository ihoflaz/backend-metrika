import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import kpiRoutes from './routes/kpiRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import helpRoutes from './routes/helpRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import sprintRoutes from './routes/sprintRoutes.js';
import mockRoutes from './routes/mockRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => {
    res.send('Metrika API is running...');
});

// Core Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/gamification', gamificationRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/documents', documentRoutes);
app.use('/notifications', notificationRoutes);

// New Feature Routes
app.use('/calendar/events', calendarRoutes);
app.use('/team', teamRoutes);
app.use('/kpi', kpiRoutes);
app.use('/settings', settingsRoutes);
app.use('/help', helpRoutes);
app.use('/analyses', analysisRoutes);
app.use('/sprints', sprintRoutes);

// Global Search and Mock fallbacks
app.use('/', mockRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
