import * as logService from '../../services/logService';
import { AgentLogAction } from '../../types';

export function logAction(action: AgentLogAction, payload: Record<string, unknown>): void {
  try {
    logService.save(action, payload);
  } catch (error) {
    console.error('Audit log error:', error);
  }
}
