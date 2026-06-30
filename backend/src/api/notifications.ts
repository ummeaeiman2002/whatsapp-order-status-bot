import { Router, Request, Response } from 'express';
import * as notificationService from '../services/notificationService';
import { NotificationType } from '../types';
import { sendError, sendPaginated } from '../lib/api-response';
import { BadRequestError } from '../lib/api-error';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { type, page: pageStr, limit: limitStr } = req.query as Record<string, string>;

    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 20;

    if (page < 1) throw new BadRequestError('Page must be >= 1');
    if (limit < 1 || limit > 100) throw new BadRequestError('Limit must be between 1 and 100');

    let validatedType: NotificationType | undefined;
    if (type) {
      if (!Object.values(NotificationType).includes(type as NotificationType)) {
        throw new BadRequestError(`Invalid notification type. Valid values: ${Object.values(NotificationType).join(', ')}`);
      }
      validatedType = type as NotificationType;
    }

    const result = notificationService.list(validatedType, page, limit);
    sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error);
    } else {
      console.error('Notifications list error:', error);
      sendError(res, new (require('../lib/api-error').InternalError)('An unexpected error occurred'));
    }
  }
});

export default router;
