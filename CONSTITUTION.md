# AI Order Status Agent Constitution

Version: 1.0.0
Status: Approved
Project Type: Portfolio Grade AI Agent
Architecture: Full Stack Web Application
Owner: Developer

---

# 1. Project Vision

The AI Order Status Agent is an intelligent customer support system that allows users to inquire about order status through a chat interface.

The system retrieves order information from the database, analyzes tracking updates, detects delays, generates contextual responses using an LLM, and maintains complete conversation history.

The system must simulate a real-world ecommerce support environment without relying on paid ecommerce platforms.

---

# 2. Core Objective

Reduce manual order tracking inquiries by providing:

- Instant order lookup
- Delay detection
- AI-generated customer responses
- Order tracking summaries
- Automated notification generation
- Conversation history

---

# 3. Technology Stack

## Frontend

- Next.js 15
- TypeScript
- TailwindCSS
- Shadcn UI

## Backend

- Next.js Route Handlers
- TypeScript

## Database

- Neon PostgreSQL

## AI Layer

Provider: Groq

Model:

- llama-3.3-70b-versatile

## Scheduling

- Cron Jobs

---

# 4. System Boundaries

The system SHALL NOT:

- Process payments
- Modify orders
- Cancel orders
- Issue refunds
- Access external courier systems

The system SHALL:

- Read order data
- Read tracking data
- Analyze delivery progress
- Generate support responses

---

# 5. User Roles

## Customer

Permissions:

- Chat with AI
- View order status
- View tracking history

---

## Administrator

Permissions:

- View all orders
- View all conversations
- View notifications
- View system logs

---

# 6. Functional Requirements

## FR-001

The system shall allow a user to submit a message.

---

## FR-002

The system shall identify whether the message contains an order inquiry.

---

## FR-003

The system shall extract an order number.

Example:

ORD-1001

---

## FR-004

The system shall retrieve the corresponding order.

---

## FR-005

The system shall retrieve all tracking updates.

---

## FR-006

The system shall detect delivery delays.

Delay Rule:

No tracking update for more than 48 hours.

---

## FR-007

The system shall generate a contextual response using Groq.

---

## FR-008

The system shall save conversation history.

---

## FR-009

The system shall log every agent action.

---

## FR-010

The system shall generate notifications for delayed orders.

---

# 7. Non Functional Requirements

## Performance

Average response time:

< 5 seconds

---

## Availability

Target:

99%

---

## Scalability

Support:

10,000 Orders

100 Concurrent Users

---

## Reliability

No data loss during conversations.

---

# 8. Database Design

## users

Columns:

- id
- name
- email
- role
- created_at

---

## orders

Columns:

- id
- order_number
- customer_id
- status
- courier_name
- expected_delivery_date
- created_at

---

## tracking_updates

Columns:

- id
- order_id
- current_status
- current_location
- update_time

---

## conversations

Columns:

- id
- user_id
- session_id
- message
- sender
- created_at

---

## notifications

Columns:

- id
- order_id
- notification_type
- message
- created_at

---

## agent_logs

Columns:

- id
- action
- payload
- created_at

---

# 9. Order States

Valid values:

- Pending
- Processing
- Packed
- Shipped
- In Transit
- Out For Delivery
- Delivered
- Delayed
- Returned

No other values are allowed.

---

# 10. Tracking States

Valid values:

- Shipment Created
- Picked Up
- Hub Received
- In Transit
- Destination Hub
- Out For Delivery
- Delivered

No other values are allowed.

---

# 11. AI Agent Responsibilities

The AI Agent must:

1. Understand user intent.
2. Extract order numbers.
3. Retrieve order context.
4. Analyze delivery progress.
5. Detect delays.
6. Generate customer-friendly responses.
7. Never hallucinate data.
8. Never invent tracking updates.
9. Never invent delivery dates.

---

# 12. Prompt Engineering Rules

The AI model shall receive:

- Order Data
- Tracking Data
- Delay Analysis
- User Message

The model shall not receive:

- Database credentials
- Internal logs
- System secrets

---

# 13. Delay Detection Rules

Rule 1:

If no tracking update exists within 48 hours:

Status = Delayed

Rule 2:

If expected delivery date is exceeded:

Status = Delayed

---

# 14. Notification Types

Allowed values:

- Delay Alert
- Delivery Confirmation
- Tracking Update

---

# 15. Audit Logging

Every agent action must be logged.

Examples:

- ORDER_FETCHED
- TRACKING_ANALYZED
- DELAY_DETECTED
- RESPONSE_GENERATED

---

# 16. Security Rules

Never expose:

- API Keys
- Database Passwords
- Internal IDs

Environment variables must be stored in:

.env

---

# 17. Seed Data Requirements

Minimum:

Users:
100

Orders:
500

Tracking Updates:
1000

Conversations:
500

Notifications:
200

---

# 18. Folder Structure

src/

app/
chat/
dashboard/
orders/
notifications/

agents/
orderStatusAgent/

ai/
groq/
prompts/

db/

services/

cron/

types/

lib/

---

# 19. Success Criteria

The project is considered complete when:

- User can chat with AI
- Order can be retrieved
- Tracking history can be analyzed
- Delay detection works
- Groq generates responses
- Conversations are stored
- Notifications are generated
- Logs are created

---

END OF CONSTITUTION