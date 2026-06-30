import { Router, Request, Response } from 'express';
import * as logService from '../services/logService';
import { AgentLogAction } from '../types';
import { sendError, sendPaginated } from '../lib/api-response';
import { BadRequestError } from '../lib/api-error';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { action, page: pageStr, limit: limitStr } = req.query as Record<string, string>;

    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 50;

    if (page < 1) throw new BadRequestError('Page must be >= 1');
    if (limit < 1 || limit > 200) throw new BadRequestError('Limit must be between 1 and 200');

    let validatedAction: AgentLogAction | undefined;
    if (action) {
      if (!Object.values(AgentLogAction).includes(action as AgentLogAction)) {
        throw new BadRequestError(`Invalid action. Valid values: ${Object.values(AgentLogAction).join(', ')}`);
      }
      validatedAction = action as AgentLogAction;
    }

    const result = logService.list(validatedAction, page, limit);
    sendPaginated(res, result.data, result.total, result.page, result.limit);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error);
    } else {
      console.error('Logs list error:', error);
      sendError(res, new (require('../lib/api-error').InternalError)('An unexpected error occurred'));
    }
  }
});

export default router;
