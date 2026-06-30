import * as agentLogsQuery from '../db/queries/agentLogs';
import { AgentLog, AgentLogAction, PaginatedResult } from '../types';

export function save(action: AgentLogAction, payload: Record<string, unknown>): AgentLog {
  return agentLogsQuery.saveLog(action, payload);
}

export function list(
  action?: AgentLogAction,
  page?: number,
  limit?: number,
): PaginatedResult<AgentLog> {
  return agentLogsQuery.listLogs(action, page, limit);
}
