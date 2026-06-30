# AI Agent Core Tasks

## T-AG-001: Groq SDK Integration
- Install `groq-sdk`
- Create `src/ai/groq/client.ts` with initialized Groq client using `GROQ_API_KEY` from env
- Implement typed chat completion wrapper: `generateResponse(messages, systemPrompt)`
- Handle rate limiting and timeout errors with retry logic (max 2 retries)

## T-AG-002: Intent Classifier
- Create `src/agents/orderStatusAgent/intentClassifier.ts`
- Function: `classifyIntent(message: string): OrderInquiry | General`
- Use regex for ORD-\d{4} detection + keyword heuristics
- Return confidence score

## T-AG-003: Order Number Extractor
- Create `src/agents/orderStatusAgent/orderExtractor.ts`
- Function: `extractOrderNumber(message: string): string | null`
- Regex extraction: `ORD-\d{4}`
- Handle multiple matches (return first valid)
- Return null if no match found

## T-AG-004: Order + Tracking Fetcher
- Create `src/agents/orderStatusAgent/dataFetcher.ts`
- Function: `fetchOrderData(orderNumber: string): OrderWithTracking`
- Query orders table by order_number
- Query tracking_updates table by order_id (ordered by update_time DESC)
- Return combined object

## T-AG-005: Delay Analyzer
- Create `src/agents/orderStatusAgent/delayAnalyzer.ts`
- Function: `analyzeDelay(order: Order, trackingUpdates: TrackingUpdate[]): DelayResult`
- R1: Check if latest tracking update > 48h ago
- R2: Check if today > expected_delivery_date
- Return: `{ isDelayed: boolean, ruleTriggered: string | null, reason: string }`

## T-AG-006: Prompt Builder
- Create `src/ai/groq/prompts/orderStatusPrompt.ts`
- Function: `buildPrompt(order, tracking, delayAnalysis, userMessage): PromptPayload`
- System prompt with agent persona and rules
- Context block with order data (no internal IDs)
- Tracking timeline (newest first, max 10)
- Delay analysis block
- User message as final input
- Export system prompt template separately

## T-AG-007: Agent Pipeline Orchestrator
- Create `src/agents/orderStatusAgent/index.ts`
- Function: `processMessage(userMessage: string, userId: string, sessionId: string): AgentResponse`
- Orchestrate steps 1-10 in sequence
- Error handling at each step with fallback responses
- Return { message, orderNumber, isDelayed, trackingUpdates }

## T-AG-008: Audit Logger
- Create `src/agents/orderStatusAgent/auditLogger.ts`
- Function: `logAction(action: AgentLogAction, payload: object)`
- Insert record into agent_logs table
- Non-blocking (fire and forget, don't hold up response)

## T-AG-009: Notification Generator
- Create `src/agents/orderStatusAgent/notificationGenerator.ts`
- Function: `generateDelayNotification(orderId: string, orderNumber: string, reason: string)`
- Check for existing notification to prevent duplicates
- Insert into notifications table with type 'Delay Alert'
