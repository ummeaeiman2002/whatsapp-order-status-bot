# AI Agent Core Implementation Plan

## Phase 1: Foundation (T-AG-001, T-AG-008)
1. Install `groq-sdk`, set up env vars
2. Create Groq client with error handling
3. Create audit logger (needed by every step)
4. Verify Groq API connectivity

## Phase 2: Data Layer (T-AG-004, T-AG-003)
1. Implement order number extractor with regex
2. Implement order + tracking data fetcher
3. Test with known ORD-XXXX values from seed data
4. Ensure 404 handling for missing orders

## Phase 3: Analysis (T-AG-005, T-AG-009)
1. Build delay analyzer with R1 and R2
2. Test with: just-updated orders, stale orders, past-due orders
3. Build notification generator with duplicate prevention
4. Wire delay detection → notification creation

## Phase 4: Prompt & Response (T-AG-002, T-AG-006)
1. Build intent classifier
2. Write system prompt template following include/exclude rules
3. Build prompt constructor with all context blocks
4. Test prompt output for:
   - No internal IDs or secrets leakage
   - Complete order context
   - Clear delay signal

## Phase 5: Orchestration (T-AG-007)
1. Wire all components into pipeline orchestrator
2. Add error boundaries at each step
3. Instrument audit logging calls at every gate
4. Test full flow: message → intent → extract → fetch → analyze → prompt → Groq → save → log → respond
5. Measure < 5s end-to-end target
