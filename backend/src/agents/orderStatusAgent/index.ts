import { classifyIntent } from './intentClassifier';
import { extractOrderNumber } from './orderExtractor';
import { fetchOrderData } from './dataFetcher';
import { analyzeDelay } from './delayAnalyzer';
import { logAction } from './auditLogger';
import { generateDelayNotification } from './notificationGenerator';
import { buildPrompt } from '../../ai/groq/prompts/orderStatusPrompt';
import { generateResponse } from '../../ai/groq/client';
import * as conversationService from '../../services/conversationService';
import { AgentLogAction, AgentResponse, SenderType } from '../../types';

export async function processMessage(
  userMessage: string,
  userId: string,
  sessionId: string,
): Promise<AgentResponse> {
  const defaultResponse: AgentResponse = {
    message: '',
    orderNumber: null,
    isDelayed: false,
    trackingUpdates: [],
  };

  // Step 1: Save user message
  conversationService.save(userId, sessionId, userMessage, SenderType.User);

  // Step 2: Classify intent
  const intent = classifyIntent(userMessage);
  if (intent !== 'order_inquiry') {
    const message = 'How can I help you? You can ask about your order status by providing your order number (e.g., ORD-1001).';
    conversationService.save(userId, sessionId, message, SenderType.Agent);
    return { ...defaultResponse, message };
  }

  // Step 3: Extract order number
  const orderNumber = extractOrderNumber(userMessage);
  if (!orderNumber) {
    const message = 'I understand you need help with an order. Could you please provide your order number? It should start with ORD- followed by 4 digits (e.g., ORD-1001).';
    conversationService.save(userId, sessionId, message, SenderType.Agent);
    return { ...defaultResponse, message };
  }

  // Step 4: Fetch order + tracking
  let orderWithTracking;
  try {
    orderWithTracking = fetchOrderData(orderNumber);
    logAction(AgentLogAction.OrderFetched, { order_number: orderNumber, found: true });
  } catch {
    logAction(AgentLogAction.OrderFetched, { order_number: orderNumber, found: false });
    const message = `I'm sorry, I couldn't find an order with number ${orderNumber}. Please check the order number and try again.`;
    conversationService.save(userId, sessionId, message, SenderType.Agent);
    return { ...defaultResponse, message };
  }

  const { order, trackingUpdates } = orderWithTracking;

  // Step 5: Analyze tracking
  logAction(AgentLogAction.TrackingAnalyzed, {
    order_number: orderNumber,
    update_count: trackingUpdates.length,
    latest_update_time: trackingUpdates[0]?.update_time || null,
  });

  // Step 6: Detect delays
  const delayResult = analyzeDelay(order, trackingUpdates);
  logAction(AgentLogAction.DelayDetected, {
    order_number: orderNumber,
    is_delayed: delayResult.isDelayed,
    rule_triggered: delayResult.ruleTriggered,
    reason: delayResult.reason,
  });

  // Step 6b: Generate notification if delayed
  if (delayResult.isDelayed) {
    generateDelayNotification(order.id, order.order_number, delayResult.reason || 'Unknown reason');
  }

  // Step 7: Build prompt and call Groq
  const { systemPrompt, userPrompt } = buildPrompt(order, trackingUpdates, delayResult, userMessage);
  const aiResponse = await generateResponse(systemPrompt, userPrompt);
  logAction(AgentLogAction.ResponseGenerated, {
    order_number: orderNumber,
    response_preview: aiResponse.substring(0, 100),
    token_count: aiResponse.length,
  });

  // Step 8: Save agent response
  conversationService.save(userId, sessionId, aiResponse, SenderType.Agent);

  return {
    message: aiResponse,
    orderNumber: order.order_number,
    isDelayed: delayResult.isDelayed,
    trackingUpdates,
  };
}
