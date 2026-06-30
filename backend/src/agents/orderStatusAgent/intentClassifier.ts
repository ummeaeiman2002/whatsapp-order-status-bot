const ORDER_KEYWORDS = [
  'order', 'delivery', 'tracking', 'package', 'shipping',
  'shipment', 'ORD-', 'status', 'delivered', 'shipped',
];

export function isOrderInquiry(message: string): boolean {
  const lower = message.toLowerCase();
  return ORDER_KEYWORDS.some((kw) => lower.includes(kw));
}

export function classifyIntent(message: string): 'order_inquiry' | 'general' {
  const hasOrderPattern = /ORD-\d{4}/.test(message);
  const hasKeywords = isOrderInquiry(message);

  if (hasOrderPattern || hasKeywords) {
    return 'order_inquiry';
  }
  return 'general';
}
