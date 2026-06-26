import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ───────────────────────────────────────────
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Golf4Good API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

import scoreRoutes from './routes/scoreRoutes.js';
import charityRoutes from './routes/charityRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import drawRoutes from './routes/drawRoutes.js';

import adminRoutes from './routes/adminRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/testimonials', testimonialRoutes);

// ─── 404 Handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ─── Error Handler ──────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`
  ┌─────────────────────────────────────────┐
  │                                         │
  │   ⛳ Golf4Good API Server               │
  │                                         │
  │   Port:        ${String(env.PORT).padEnd(24)}│
  │   Environment: ${env.NODE_ENV.padEnd(24)}│
  │   Health:      http://localhost:${env.PORT}/api/health │
  │                                         │
  └─────────────────────────────────────────┘
  `);
  console.log('Backend successfully restarted and new Supabase IPv4 connection loaded.');
});

export default app;
