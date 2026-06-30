# SDD — AI Order Status Agent

## Stack
Next.js 15 + TypeScript + TailwindCSS + Shadcn UI | Neon PostgreSQL | Groq (llama-3.3-70b-versatile) | Cron Jobs

## Folder Structure
```
src/
  app/
    chat/       # Customer chat interface
    dashboard/  # Admin dashboard
    orders/     # Order list/detail
    notifications/ # Notification list
  agents/
    orderStatusAgent/  # Core agent pipeline
  ai/
    groq/
      prompts/  # Prompt templates
  db/           # Schema, queries, seed
  services/     # Business logic
  cron/         # Scheduled tasks
  types/        # TypeScript types
  lib/          # Utilities
```

## Database (6 tables)
| Table | Key Columns |
|---|---|
| users | id, name, email, role, created_at |
| orders | id, order_number (ORD-XXXX), customer_id, status, courier_name, expected_delivery_date, created_at |
| tracking_updates | id, order_id, current_status, current_location, update_time |
| conversations | id, user_id, session_id, message, sender, created_at |
| notifications | id, order_id, notification_type, message, created_at |
| agent_logs | id, action, payload, created_at |

### Valid Enums
- **Order Status**: Pending, Processing, Packed, Shipped, In Transit, Out For Delivery, Delivered, Delayed, Returned
- **Tracking Status**: Shipment Created, Picked Up, Hub Received, In Transit, Destination Hub, Out For Delivery, Delivered
- **Notification Type**: Delay Alert, Delivery Confirmation, Tracking Update
- **Agent Log Action**: ORDER_FETCHED, TRACKING_ANALYZED, DELAY_DETECTED, RESPONSE_GENERATED

### Seed Data
100 users, 500 orders, 1000 tracking updates, 500 conversations, 200 notifications

## Agent Pipeline (src/agents/orderStatusAgent/)
1. User message → 2. Intent classify → 3. Extract order number (ORD-\d+) → 4. Fetch order + tracking → 5. Delay analysis → 6. Build prompt → 7. Groq call → 8. Save conversation → 9. Log action → 10. Return response

## Delay Detection Rules
- **R1**: No tracking update in 48h → Delayed
- **R2**: Past expected delivery date → Delayed

## Prompt Rules
**Include**: Order data, tracking data, delay analysis, user message
**Exclude**: DB credentials, internal logs, system secrets

## System Boundaries
SHALL: Read order/tracking data, analyze delivery, generate responses
SHALL NOT: Process payments, modify/cancel orders, issue refunds, access external couriers

## User Roles
- **Customer**: Chat with AI, view order status, view tracking history
- **Admin**: View all orders/conversations/notifications/logs

## Functional Requirements
FR-001: Submit message | FR-002: Identify order inquiry | FR-003: Extract order number | FR-004: Retrieve order | FR-005: Retrieve tracking | FR-006: Detect delays | FR-007: Groq response | FR-008: Save conversation | FR-009: Log every action | FR-010: Generate delay notifications

## NFRs
Response <5s, Availability 99%, 10K orders / 100 concurrent users, no data loss

## Security
All secrets in .env, never in code
