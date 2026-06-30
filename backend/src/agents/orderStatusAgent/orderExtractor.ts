import { ORDER_NUMBER_REGEX } from '../../types';

export function extractOrderNumber(message: string): string | null {
  const match = message.match(ORDER_NUMBER_REGEX);
  return match ? match[0] : null;
}

export function extractAllOrderNumbers(message: string): string[] {
  const matches = message.match(new RegExp(ORDER_NUMBER_REGEX.source, 'g'));
  return matches || [];
}
