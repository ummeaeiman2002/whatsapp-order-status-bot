import { getStore } from '../client';
import { AgentLog, AgentLogAction, PaginatedResult } from '../../types';

export function saveLog(action: AgentLogAction, payload: Record<string, unknown>): AgentLog {
  const log: AgentLog = {
    id: crypto.randomUUID(),
    action,
    payload,
    created_at: new Date().toISOString(),
  };
  getStore().agentLogs.push(log);
  return log;
}

export function listLogs(
  action?: AgentLogAction,
  page = 1,
  limit = 50,
): PaginatedResult<AgentLog> {
  let filtered = [...getStore().agentLogs];

  if (action) {
    filtered = filtered.filter((l) => l.action === action);
  }

  filtered.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit);

  return { data, total, page, limit };
}
