import { Router, Request, Response } from 'express';
import { processMessage } from '../agents/orderStatusAgent';
import * as conversationService from '../services/conversationService';
import { checkRateLimit } from '../lib/rate-limiter';
import { sendSuccess, sendError } from '../lib/api-response';
import { BadRequestError } from '../lib/api-error';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, sessionId, userId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new BadRequestError('Message is required and must be a non-empty string');
    }
    if (!sessionId || typeof sessionId !== 'string') {
      throw new BadRequestError('Session ID is required');
    }

    const rateCheck = checkRateLimit(sessionId, { windowMs: 60_000, maxRequests: 10 });
    if (!rateCheck.allowed) {
      res.setHeader('Retry-After', rateCheck.retryAfter.toString());
      sendError(res, Object.assign(new Error(`Too many requests. Retry after ${rateCheck.retryAfter} seconds.`), { statusCode: 429, code: 'RATE_LIMITED' }));
      return;
    }

    const actualUserId = userId || '00000000-0000-0000-0000-000000000000';
    const response = await processMessage(message, actualUserId, sessionId);

    sendSuccess(res, {
      reply: response.message,
      order: response.orderNumber
        ? {
            order_number: response.orderNumber,
            is_delayed: response.isDelayed,
          }
        : null,
      isDelayed: response.isDelayed,
    });
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error);
    } else {
      console.error('Chat POST error:', error);
      sendError(res, new (require('../lib/api-error').InternalError)('An unexpected error occurred'));
    }
  }
});

router.get('/', (req: Request, res: Response) => {
  try {
    const { sessionId, userId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      throw new BadRequestError('Session ID query parameter is required');
    }

    const actualUserId = (typeof userId === 'string' ? userId : '00000000-0000-0000-0000-000000000000') as string;
    const messages = conversationService.getBySessionId(sessionId);

    sendSuccess(res, { messages, sessionId, userId: actualUserId });
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error);
    } else {
      console.error('Chat GET error:', error);
      sendError(res, new (require('../lib/api-error').InternalError)('An unexpected error occurred'));
    }
  }
});

export default router;
