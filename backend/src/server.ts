import { env } from './env';
import './db/seed';
import app from './app';

const port = env.PORT;

app.listen(port, () => {
  console.log(`\n  🚀 Order Status Agent Backend`);
  console.log(`  ─────────────────────────────`);
  console.log(`  Environment: ${env.NODE_ENV}`);
  console.log(`  Port:        ${port}`);
  console.log(`  Groq:        ${env.GROQ_API_KEY ? 'Connected' : 'Fallback mode (no API key)'}`);
  console.log(`  Seed Data:   Loaded\n`);
  console.log(`  Endpoints:`);
  console.log(`  POST /api/chat              Send message`);
  console.log(`  GET  /api/chat?sessionId=   Get conversation history`);
  console.log(`  GET  /api/orders            List orders`);
  console.log(`  GET  /api/orders/:id        Order detail`);
  console.log(`  GET  /api/notifications     List notifications`);
  console.log(`  GET  /api/logs              View audit logs`);
  console.log(`  POST /api/cron/scan-delays  Trigger delay scan`);
  console.log(`  GET  /api/health            Health check\n`);
});
