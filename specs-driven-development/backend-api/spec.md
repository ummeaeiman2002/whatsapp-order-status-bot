# Backend API Specification

## Source
CONSTITUTION.md §4, §6, §7, §16, §19; FR-004, FR-005, FR-009

## Architecture
Next.js Route Handlers (App Router) + TypeScript

## System Boundaries

| Shall | Shall Not |
|---|---|
| Read order data | Process payments |
| Read tracking data | Modify orders |
| Analyze delivery progress | Cancel orders |
| Generate support responses | Issue refunds |
| Save conversations | Access external courier APIs |
| Log all agent actions | |

## API Routes

### POST /api/chat
- **Purpose**: Submit user message and receive agent response
- **Auth**: Customer or Admin
- **Body**: `{ message: string, sessionId: string }`
- **Response**: `{ reply: string, order?: OrderSummary, isDelayed?: boolean }`
- **Errors**: 400 (missing message), 429 (rate limited), 500 (internal)

### GET /api/chat
- **Purpose**: Retrieve conversation history
- **Auth**: Customer (own) or Admin (any)
- **Query**: `sessionId: string`
- **Response**: `{ messages: Conversation[] }`

### GET /api/orders
- **Purpose**: List orders with search/filter
- **Auth**: Admin only
- **Query**: `search?: string, status?: OrderStatus, page?: number, limit?: number`
- **Response**: `{ orders: Order[], total: number, page: number }`

### GET /api/orders/[id]
- **Purpose**: Order detail with full tracking history
- **Auth**: Customer (own) or Admin (any)
- **Response**: `{ order: Order, trackingUpdates: TrackingUpdate[] }`

### GET /api/notifications
- **Purpose**: List notifications
- **Auth**: Admin only
- **Query**: `type?: NotificationType, page?: number, limit?: number`
- **Response**: `{ notifications: Notification[], total: number }`

### GET /api/logs
- **Purpose**: View agent audit logs
- **Auth**: Admin only
- **Query**: `action?: AgentLogAction, page?: number, limit?: number`
- **Response**: `{ logs: AgentLog[], total: number }`

## Services (src/services/)

| Service | Functions |
|---|---|
| `orderService` | getByNumber(), getById(), list(filters), getByCustomer() |
| `trackingService` | getByOrderId(), getLatest() |
| `conversationService` | save(), getBySessionId() |
| `notificationService` | create(), list(filters), getByOrder() |
| `logService` | save(), list(filters) |

## Cron Jobs (src/cron/)

### delay-scanner.ts
- Runs every 15 minutes
- Queries orders with status in active states (Shipped, In Transit, Out For Delivery)
- Applies delay detection R1 and R2
- Generates Delay Alert notifications for newly detected delays
- Logs scan results

## Non-Functional Requirements
- Average response time < 5s (agent pipeline)
- Availability: 99%
- No data loss during conversations
- All secrets in .env, never in code
