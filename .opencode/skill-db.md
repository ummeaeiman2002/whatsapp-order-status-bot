# Database Skill — AI Order Status Agent

## Database
Neon PostgreSQL

## Schema (6 tables)

### users
- id (PK)
- name
- email
- role
- created_at

### orders
- id (PK)
- order_number (unique, format: ORD-XXXX)
- customer_id (FK → users.id)
- status (enum: Pending, Processing, Packed, Shipped, In Transit, Out For Delivery, Delivered, Delayed, Returned)
- courier_name
- expected_delivery_date
- created_at

### tracking_updates
- id (PK)
- order_id (FK → orders.id)
- current_status (enum: Shipment Created, Picked Up, Hub Received, In Transit, Destination Hub, Out For Delivery, Delivered)
- current_location
- update_time

### conversations
- id (PK)
- user_id (FK → users.id)
- session_id
- message
- sender
- created_at

### notifications
- id (PK)
- order_id (FK → orders.id)
- notification_type (enum: Delay Alert, Delivery Confirmation, Tracking Update)
- message
- created_at

### agent_logs
- id (PK)
- action (enum: ORDER_FETCHED, TRACKING_ANALYZED, DELAY_DETECTED, RESPONSE_GENERATED)
- payload (JSON)
- created_at

## Seed Data Minimums
- Users: 100
- Orders: 500
- Tracking Updates: 1000
- Conversations: 500
- Notifications: 200

## Constraints
- Order and tracking states must only use the allowed enum values
- Order number format: ORD-XXXX
- No data loss during conversations
- Environment variables in .env only, never hardcoded
