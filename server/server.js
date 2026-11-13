import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import hackathonRoutes from './routes/hackathonRoutes.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',').map((s) => s.trim()) || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'MatruCare AI API' }));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/hackathon', hackathonRoutes);
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: 'This account or registration already exists.' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message });
});

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`MatruCare API running on http://localhost:${port}`)))
  .catch((error) => { console.error('Server startup failed:', error.message); process.exit(1); });
