# Database Specification

## Source
CONSTITUTION.md §8, §9, §10, §14, §17

## Technology
Neon PostgreSQL

## Tables

### users
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default gen_random_uuid() |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| role | VARCHAR(50) | NOT NULL, CHECK(role IN ('Customer', 'Administrator')) |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() |

### orders
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default gen_random_uuid() |
| order_number | VARCHAR(20) | NOT NULL, UNIQUE, CHECK(~ '^ORD-\d{4}$') |
| customer_id | UUID | NOT NULL, FK → users.id |
| status | VARCHAR(50) | NOT NULL, CHECK(status IN ('Pending','Processing','Packed','Shipped','In Transit','Out For Delivery','Delivered','Delayed','Returned')) |
| courier_name | VARCHAR(255) | NOT NULL |
| expected_delivery_date | DATE | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() |

### tracking_updates
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default gen_random_uuid() |
| order_id | UUID | NOT NULL, FK → orders.id |
| current_status | VARCHAR(50) | NOT NULL, CHECK(status IN ('Shipment Created','Picked Up','Hub Received','In Transit','Destination Hub','Out For Delivery','Delivered')) |
| current_location | VARCHAR(255) | NOT NULL |
| update_time | TIMESTAMPTZ | NOT NULL, default NOW() |

### conversations
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default gen_random_uuid() |
| user_id | UUID | NOT NULL, FK → users.id |
| session_id | VARCHAR(100) | NOT NULL |
| message | TEXT | NOT NULL |
| sender | VARCHAR(50) | NOT NULL, CHECK(sender IN ('user', 'agent')) |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() |

### notifications
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default gen_random_uuid() |
| order_id | UUID | NOT NULL, FK → orders.id |
| notification_type | VARCHAR(50) | NOT NULL, CHECK(type IN ('Delay Alert','Delivery Confirmation','Tracking Update')) |
| message | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() |

### agent_logs
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default gen_random_uuid() |
| action | VARCHAR(50) | NOT NULL, CHECK(action IN ('ORDER_FETCHED','TRACKING_ANALYZED','DELAY_DETECTED','RESPONSE_GENERATED')) |
| payload | JSONB | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() |

## Seed Data
- 100 users (mix of Customer and Administrator roles)
- 500 orders spanning all valid statuses
- 1000 tracking updates distributed across orders
- 500 conversations across multiple sessions
- 200 notifications of all 3 types

## Constraints
- All enum values strictly enforced via CHECK constraints
- Order number regex: `^ORD-\d{4}$`
- FK cascading: RESTRICT on delete for production safety
- Index on orders.order_number, orders.customer_id, tracking_updates.order_id, conversations.session_id, notifications.order_id
