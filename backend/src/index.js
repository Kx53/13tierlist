import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import tierListRoutes from './routes/tierLists.js';
import { generalLimiter } from './middleware/rateLimit.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4321',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-edit-token'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(generalLimiter);

// Routes
app.use('/api/tier-lists', tierListRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
