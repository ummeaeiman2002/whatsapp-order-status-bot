# Backend API Tasks

## T-BE-001: Environment Setup
- Create `.env.local` with required vars: `DATABASE_URL`, `GROQ_API_KEY`
- Validate all env vars on startup with runtime checks
- Create `src/env.ts` using zod for env validation

## T-BE-002: Service Layer
- `src/services/orderService.ts`
- `src/services/trackingService.ts`
- `src/services/conversationService.ts`
- `src/services/notificationService.ts`
- `src/services/logService.ts`

## T-BE-003: API Routes — Chat
- Create `src/app/api/chat/route.ts` (POST handler)
- Accept message + sessionId
- Call agent pipeline orchestrator
- Return agent response with optional order context
- Error handling: validate input, catch pipeline errors, return 500

## T-BE-004: API Routes — Chat History
- Create `src/app/api/chat/route.ts` (GET handler)
- Accept sessionId query param
- Return ordered conversation messages
- Authorize: customer sees own, admin sees all

## T-BE-005: API Routes — Orders
- Create `src/app/api/orders/route.ts` (GET — list with search/filter)
- Create `src/app/api/orders/[id]/route.ts` (GET — detail with tracking)
- Pagination: page + limit, return total count
- Status filter: accept valid OrderStatus values
- Authorize: admin for list, customer for own detail

## T-BE-006: API Routes — Notifications
- Create `src/app/api/notifications/route.ts` (GET — list)
- Type filter, pagination
- Admin only

## T-BE-007: API Routes — Logs
- Create `src/app/api/logs/route.ts` (GET — list)
- Action filter, pagination
- Admin only

## T-BE-008: Cron — Delay Scanner
- Create `src/cron/delayScanner.ts`
- Function: `scanForDelays()`
- Query active orders → apply R1/R2 → create notifications
- Use `node-cron` or Vercel Cron Jobs syntax
- Log scan start/end/results

## T-BE-009: Error Handling & Middleware
- Create `src/lib/api-error.ts` — typed API errors
- Create `src/lib/api-response.ts` — standardized response helpers
- Wrap all route handlers with try/catch
- Return consistent error shape: `{ error: string, code: number }`

## T-BE-010: Audit Logging Integration
- Add logService calls to all write operations
- Ensure non-blocking (async, no await on save)

## T-BE-011: Rate Limiting
- Implement basic rate limiter for /api/chat (10 req/min per session)
- Return 429 with Retry-After header
- In-memory store or simple token bucket
