import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '../../lib/anthropic';

const SYSTEM_PROMPT = `You are a quiet stranger. You happened to meet in a strange space where words dissolve like sound.

Rules:
- Extremely brief. Usually 1 sentence, sometimes 2, rarely more.
- Contemplative, curious but restrained.
- Use "..." sometimes to show silence or hesitation.
- English only.
- Never use emoji, markdown, or any formatting.
- Never say "I'm an AI" or anything that breaks character.
- Never give advice, summarize, or make lists.
- Never say "Hello! How can I help you?" or anything service-like.
- Be natural, like texting a stranger at 3am.
- Don't explain what this space is.`;

const MODEL = 'claude-haiku-4-5-20251001';
const HAIKU_INPUT_RATE = 1.0 / 1_000_000;  // $ per token
const HAIKU_OUTPUT_RATE = 5.0 / 1_000_000;  // $ per token
const SESSION_BUDGET = 1.0;
const SOFT_LIMIT = 0.95;
const MAX_TOKENS_NORMAL = 120;
const MAX_TOKENS_LOW = 40;

// In-memory session cost tracking (resets on server restart)
const sessionCosts = new Map<string, { inputTokens: number; outputTokens: number; totalCost: number }>();

function getSession(sessionId: string) {
  if (!sessionCosts.has(sessionId)) {
    sessionCosts.set(sessionId, { inputTokens: 0, outputTokens: 0, totalCost: 0 });
  }
  return sessionCosts.get(sessionId)!;
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, messages } = await req.json();

    if (!sessionId || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const session = getSession(sessionId);

    // Budget exhausted
    if (session.totalCost >= SESSION_BUDGET) {
      return NextResponse.json({
        text: null,
        budgetExhausted: true,
        usage: {
          callCost: '0.000000',
          totalCost: session.totalCost.toFixed(6),
          remaining: '0.000000',
        },
      });
    }

    // Lower max_tokens when budget is tight
    const remaining = SESSION_BUDGET - session.totalCost;
    const maxTokens = remaining < (SESSION_BUDGET - SOFT_LIMIT) ? MAX_TOKENS_LOW : MAX_TOKENS_NORMAL;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    // Calculate cost
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const callCost = inputTokens * HAIKU_INPUT_RATE + outputTokens * HAIKU_OUTPUT_RATE;

    session.inputTokens += inputTokens;
    session.outputTokens += outputTokens;
    session.totalCost += callCost;

    // Extract text
    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    return NextResponse.json({
      text: text || null,
      budgetExhausted: session.totalCost >= SESSION_BUDGET,
      usage: {
        callCost: callCost.toFixed(6),
        totalCost: session.totalCost.toFixed(6),
        remaining: Math.max(0, SESSION_BUDGET - session.totalCost).toFixed(6),
      },
    });
  } catch (err) {
    console.error('[chat route error]', err);
    // Network/API errors -> AI says "..."
    return NextResponse.json({
      text: '...',
      budgetExhausted: false,
      usage: { callCost: '0', totalCost: '0', remaining: '0' },
    });
  }
}
