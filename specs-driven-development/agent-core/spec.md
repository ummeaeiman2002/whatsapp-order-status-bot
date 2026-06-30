# AI Agent Core Specification

## Source
CONSTITUTION.md §11, §12, §13, §15; FR-002, FR-003, FR-006, FR-007, FR-010

## AI Provider
- **Provider**: Groq
- **Model**: llama-3.3-70b-versatile
- **SDK**: `groq-sdk` npm package

## Agent Pipeline (10 steps)
1. Receive user message (from chat API)
2. Classify intent — is this an order inquiry?
3. Extract order number via regex `ORD-\d{4}`
4. Fetch order record from DB
5. Fetch all tracking updates for that order
6. Analyze for delays using defined rules
7. Build prompt with order data + tracking + delay analysis + user message
8. Call Groq API with constructed prompt
9. Save conversation (user message + agent response) to DB
10. Log every action to agent_logs table

## Intent Classification Rules
- If message contains a pattern matching `ORD-\d{4}` → Order inquiry
- If message references "order", "delivery", "tracking", "package", "shipping" → likely order inquiry
- Otherwise → route to general response or fallback

## Delay Detection Rules (R1, R2)
- **R1**: No tracking update in the last 48 hours → mark as Delayed
- **R2**: Current date > expected_delivery_date → mark as Delayed
- Both rules run independently; either trigger marks the order

## Prompt Construction Rules
### MUST Include
- Complete order record (order_number, status, courier, expected_delivery_date)
- Tracking update timeline (newest first, max 10 entries)
- Delay analysis result (delayed: yes/no + which rule triggered)
- Original user message

### MUST NOT Include
- Database credentials or connection strings
- Internal system logs
- API keys or secrets
- Internal IDs (UUIDs)

## Response Requirements
- Customer-friendly tone
- Only use data provided in prompt (no hallucination)
- Never invent tracking updates or delivery dates
- Include order number and current status
- If delayed, explain reason and next steps

## Audit Logging
Every pipeline step logs to agent_logs:
| Action | When | Payload |
|---|---|---|
| ORDER_FETCHED | After step 4 | { order_number, found: bool } |
| TRACKING_ANALYZED | After step 5 | { update_count, latest_update_time } |
| DELAY_DETECTED | After step 6 | { is_delayed, rule_triggered, reason } |
| RESPONSE_GENERATED | After step 8 | { response_preview: first 100 chars, token_count } |

## Notification Generation
When delay detected (FR-010):
- Insert a notification record with type 'Delay Alert'
- Notification message must include order number and delay reason
- Avoid duplicate notifications for the same delay event
