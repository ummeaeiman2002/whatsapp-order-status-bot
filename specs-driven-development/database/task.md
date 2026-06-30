# Database Tasks

## T-DB-001: Define TypeScript Types
- Create `src/types/index.ts` with interfaces for all 6 tables
- Define enums: OrderStatus, TrackingStatus, NotificationType, AgentLogAction, UserRole
- Ensure alignment with DB CHECK constraints

## T-DB-002: Create Database Schema
- Write `src/db/schema.sql` with CREATE TABLE statements
- Include all CHECK constraints, FK references, UUID defaults, indexes
- Create `src/db/migrate.ts` migration runner using Neon serverless driver

## T-DB-003: Implement Query Functions
- `src/db/queries/orders.ts` — getOrderByNumber(), getOrdersByCustomer(), getAllOrders()
- `src/db/queries/tracking.ts` — getTrackingUpdatesByOrderId(), getLatestTrackingUpdate()
- `src/db/queries/conversations.ts` — saveConversation(), getConversationBySession()
- `src/db/queries/notifications.ts` — getNotificationsByOrder(), getAllNotifications()
- `src/db/queries/agentLogs.ts` — saveLog(), getLogs()
- `src/db/queries/users.ts` — getUserById(), getUserByEmail()

## T-DB-004: Connection Setup
- Configure Neon connection via `DATABASE_URL` in .env
- Create `src/db/client.ts` with pooled/direct connection using @neondatabase/serverless

## T-DB-005: Seed Script
- Write `src/db/seed.ts` generating:
  - 100 users with realistic names/emails
  - 500 orders with varied statuses and dates
  - 1000 tracking updates across a 7-step lifecycle
  - 500 conversation messages across sessions
  - 200 notifications
- Ensure deterministic seed via fixed seed value for reproducibility

## T-DB-006: Index Optimization
- Add composite indexes for frequent query patterns
- Analyze query plans for order lookup + tracking retrieval hot path
