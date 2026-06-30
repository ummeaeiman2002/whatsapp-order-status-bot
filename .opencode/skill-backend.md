# Backend Skill — AI Order Status Agent

## Architecture
Next.js Route Handlers + TypeScript

## Services (src/services/)
- Order lookup service (by order_number)
- Tracking retrieval service (by order_id)
- Delay analysis service (48h rule + expected date rule)
- Conversation save/load service
- Notification generation service
- Audit logging service

## API Routes (src/app/api/)

### /api/chat
- POST: Accept user message, run agent pipeline, return response
- GET: Retrieve conversation history by session_id

### /api/orders
- GET: List/search orders (admin)
- GET /[id]: Order detail with tracking

### /api/notifications
- GET: List notifications

### /api/logs
- GET: View agent logs (admin)

## Cron Jobs (src/cron/)
- Scheduled delay scan: Check all active orders for delay rules
- Generate Delay Alert notifications for newly delayed orders
- Ensure no duplicate notifications per order

## Agent Pipeline (src/agents/orderStatusAgent/)
1. Receive user message
2. Classify intent (order inquiry vs general)
3. Extract order number via regex (ORD-\d+)
4. Fetch order + tracking from DB
5. Analyze for delays
6. Build prompt with context
7. Call Groq (llama-3.3-70b-versatile)
8. Save conversation
9. Log action
10. Return response to user
