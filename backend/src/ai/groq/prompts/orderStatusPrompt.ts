import { Order, TrackingUpdate, DelayResult } from '../../../types';

export function buildPrompt(
  order: Order,
  trackingUpdates: TrackingUpdate[],
  delayAnalysis: DelayResult,
  userMessage: string,
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are a helpful customer support agent for an e-commerce platform.
Your role is to help customers check their order status and tracking information.

Rules:
- Only use the order data, tracking data, and delay analysis provided below.
- Do not invent or hallucinate any tracking updates, delivery dates, or order details.
- If the order is delayed, explain the reason clearly and apologize.
- Keep responses concise, friendly, and professional.
- Always include the order number in your response.`;

  const contextBlocks: string[] = [];

  contextBlocks.push(`[ORDER DATA]
Order Number: ${order.order_number}
Current Status: ${order.status}
Courier: ${order.courier_name}
Expected Delivery: ${order.expected_delivery_date}`);

  if (trackingUpdates.length > 0) {
    const timeline = trackingUpdates.slice(0, 10).map(
      (t) => `  - ${t.update_time}: ${t.current_status} at ${t.current_location}`,
    );
    contextBlocks.push(`[TRACKING HISTORY]
${timeline.join('\n')}`);
  } else {
    contextBlocks.push('[TRACKING HISTORY]\n  No tracking updates available yet.');
  }

  contextBlocks.push(`[DELAY ANALYSIS]
Is Delayed: ${delayAnalysis.isDelayed}
${delayAnalysis.ruleTriggered ? `Rule Triggered: ${delayAnalysis.ruleTriggered}` : ''}
${delayAnalysis.reason ? `Reason: ${delayAnalysis.reason}` : ''}`);

  const userPrompt = `${contextBlocks.join('\n\n')}

[CUSTOMER MESSAGE]
${userMessage}

Please respond to the customer based on the above information.`;

  return { systemPrompt, userPrompt };
}
