import Groq from 'groq-sdk';
import { env } from '../../env';

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    client = new Groq({ apiKey: env.GROQ_API_KEY || undefined });
  }
  return client;
}

export async function generateResponse(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const apiKey = env.GROQ_API_KEY;

  if (!apiKey) {
    return generateFallbackResponse(userMessage);
  }

  try {
    const completion = await getClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
  } catch (error) {
    console.error('Groq API error:', error);
    return generateFallbackResponse(userMessage);
  }
}

function generateFallbackResponse(_userMessage: string): string {
  return 'I apologize, but the AI service is currently unavailable. Please try again later or contact our support team for assistance.';
}

export function getSystemPromptTemplate(): string {
  return `You are a helpful customer support agent for an e-commerce platform.
Your role is to help customers check their order status and tracking information.

Rules:
- Only use the order data, tracking data, and delay analysis provided to you.
- Do not invent or hallucinate any tracking updates, delivery dates, or order details.
- If the order is delayed, explain the reason clearly and apologize.
- Keep responses concise, friendly, and professional.
- Always include the order number in your response.
- If you don't have enough information, ask the customer for their order number.`;
}
