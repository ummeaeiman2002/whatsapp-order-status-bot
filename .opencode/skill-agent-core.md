# AI Agent Core Skill — Order Status Agent

## AI Provider
Groq — Model: llama-3.3-70b-versatile

## Agent Responsibilities
1. Understand user intent
2. Extract order numbers (format: ORD-XXXX)
3. Retrieve order context from DB
4. Analyze delivery progress from tracking updates
5. Detect delays via rules below
6. Generate customer-friendly responses via Groq
7. Never hallucinate data
8. Never invent tracking updates
9. Never invent delivery dates

## Prompt Engineering Rules

### MUST include in prompt:
- Order Data
- Tracking Data
- Delay Analysis
- User Message

### MUST NOT include:
- Database credentials
- Internal logs
- System secrets

## Delay Detection Rules
- **Rule 1**: No tracking update within 48 hours → Status = Delayed
- **Rule 2**: Expected delivery date exceeded → Status = Delayed

## Audit Logging
Every agent action must be logged with action enum:
- ORDER_FETCHED
- TRACKING_ANALYZED
- DELAY_DETECTED
- RESPONSE_GENERATED

## Functional Coverage
- FR-001: User message submission
- FR-002: Order inquiry identification
- FR-003: Order number extraction
- FR-004: Order retrieval
- FR-005: Tracking update retrieval
- FR-006: Delay detection
- FR-007: Groq contextual response generation
- FR-008: Conversation history save
- FR-009: Agent action logging
- FR-010: Delay notification generation

## Security
- Never expose API keys, DB passwords, internal IDs
- Use .env for all secrets
