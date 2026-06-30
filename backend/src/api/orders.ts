import { Router, Request, Response } from 'express';
import * as orderService from '../services/orderService';
import * as trackingService from '../services/trackingService';
import { OrderStatus } from '../types';
import { sendSuccess, sendError, sendPaginated } from '../lib/api-response';
import { BadRequestError } from '../lib/api-error';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const {
      search,
      status,
      page: pageStr,
      limit: limitStr,
      userId,
      userRole,
    } = req.query as Record<string, string>;

    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 20;

    if (page < 1) throw new BadRequestError('Page must be >= 1');
    if (limit < 1 || limit > 100) throw new BadRequestError('Limit must be between 1 and 100');

    let validatedStatus: OrderStatus | undefined;
    if (status) {
      if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
        throw new BadRequestError(`Invalid status. Valid values: ${Object.values(OrderStatus).join(', ')}`);
      }
      validatedStatus = status as OrderStatus;
    }

    const result = orderService.list(
      userId || '',
      (userRole as any) || 'Customer',
      search,
      validatedStatus,
      page,
      limit,
    );

    sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error);
    } else {
      console.error('Orders list error:', error);
      sendError(res, new (require('../lib/api-error').InternalError)('An unexpected error occurred'));
    }
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, userRole } = req.query as Record<string, string>;

    const order = orderService.verifyOrderAccess(id, userId || '', (userRole as any) || 'Customer');
    const trackingUpdates = trackingService.getByOrderId(id);

    sendSuccess(res, { order, trackingUpdates });
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error);
    } else {
      console.error('Order detail error:', error);
      sendError(res, new (require('../lib/api-error').InternalError)('An unexpected error occurred'));
    }
  }
});

export default router;
