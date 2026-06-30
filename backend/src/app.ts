import express from 'express';
import cors from 'cors';
import chatRouter from './api/chat';
import ordersRouter from './api/orders';
import notificationsRouter from './api/notifications';
import logsRouter from './api/logs';
import { sendError } from './lib/api-response';
import { AppError } from './lib/api-error';
import { scanForDelays } from './cron/delayScanner';

const app = express();

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/logs', logsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  if (err instanceof AppError) {
    sendError(res, err);
  } else {
    sendError(res, new AppError(500, 'INTERNAL_ERROR', 'Internal server error'));
  }
});

// Cron endpoint (for external cron trigger or manual invocation)
app.post('/api/cron/scan-delays', (_req, res) => {
  const result = scanForDelays();
  res.json({ success: true, ...result });
});

export default app;
