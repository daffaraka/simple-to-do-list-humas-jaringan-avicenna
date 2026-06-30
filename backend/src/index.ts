import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import checklistRoutes from './routes/checklists';
import boardRoutes from './routes/boards';
import roleRoutes from './routes/roles';
import departmentRoutes from './routes/departments';
import userRoutes from './routes/users';
import kpiRoutes from './routes/kpis';
import commentRoutes from './routes/comments';
import notificationRoutes from './routes/notifications';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/checklists', checklistRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/kpis', kpiRoutes);
app.use('/api/tasks/:taskId/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
