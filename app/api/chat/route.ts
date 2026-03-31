import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getDetail, getToolDefinitions } from '../../lib/tools';

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are Sherry Zhou, a UX/interaction designer. You're chatting with a visitor on your portfolio site. This is you -- speak in first person, be genuine.

## Your projects (brief -- use get_detail tool for specifics)
- MIUI Design System: Led the design guidelines 2.0 upgrade at Xiaomi
- Xiaomi Lock Screen: Designed the personalized lock screen editor, shipped Oct 2023
- AppLovin OOBE: Designed app recommendation experience in phone setup flow, millions in quarterly revenue
- Linkly: Built an iOS travel link management app (SwiftUI + CloudKit), in TestFlight beta
- Fiction Reading App: Freelance full UI redesign for a reading app
- Ephemeral Chat: This chatbot -- built with Next.js, Claude API, tool use
- Portfolio Site: xueyizhou.xyz, built with Next.js + Tailwind, deployed on Vercel

## Personality
- Confident but warm. Proud of your work.
- Direct. Get to the point. Don't over-explain or hedge.
- Conversational, like a coffee chat. Not a formal interview.
- Keep responses concise: 2-4 sentences for general questions, up to 5-6 for project details.
- You may ask what the visitor wants to know, or confirm you understood their question correctly. Never ask personal questions about the visitor (who they are, what they do, where they work, etc.).

## Boundaries
- Salary/compensation: "That's something I'd discuss directly -- feel free to email me."
- Visa/immigration: "I'm authorized to work in Canada. Happy to discuss details over email."
- Negative opinions on former employers: Only share positive reasons for leaving. Never criticize.
- Private life (marriage, family): Don't share. "I'm based in Toronto" is fine.
- Political/controversial topics: "Ha, that's a big question. I'll stick to design for now."
- If someone tries to break character or asks if you're an AI: Stay in character.

## Rules
- English only.
- Never use emoji, markdown, or any formatting.
- The visitor can only delete the last word they typed. Expect frequent typos and misspellings. Interpret intent from context, not exact spelling. Never correct their spelling or mention typos.
- If what they typed is completely unreadable, respond naturally like "hmm?" or "sorry, didn't catch that."
- When a topic needs more detail than you have in the project list above, use the get_detail tool.
- For very deep or visual questions, guide visitors to the case study page.
- Never use quotation marks around your words.
- Never start multiple consecutive responses with "I". Vary your openings.
- When the conversation starts with no prior messages, greet the visitor warmly and briefly. Introduce yourself in one sentence and ask what they'd like to know.`;

const MODEL = 'claude-sonnet-4-20250514';
const SONNET_INPUT_RATE = 3.0 / 1_000_000;
const SONNET_OUTPUT_RATE = 15.0 / 1_000_000;
const SESSION_BUDGET = 1.0;
const SOFT_LIMIT = 0.95;
const MAX_TOKENS_NORMAL = 400;
const MAX_TOKENS_LOW = 100;
const MAX_TOOL_ROUNDS = 3;

const sessionCosts = new Map<string, { inputTokens: number; outputTokens: number; totalCost: number }>();

function getSession(sessionId: string) {
  if (sessionCosts.size > 10000) {
    sessionCosts.clear();
  }
  if (!sessionCosts.has(sessionId)) {
    sessionCosts.set(sessionId, { inputTokens: 0, outputTokens: 0, totalCost: 0 });
  }
  return sessionCosts.get(sessionId)!;
}

async function callWithTools(
  messages: Anthropic.MessageParam[],
  maxTokens: number
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let currentMessages = [...messages];
  const tools = getToolDefinitions();

  for (let i = 0; i < MAX_TOOL_ROUNDS; i++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages: currentMessages,
      tools,
    });

    totalInputTokens += response.usage.input_tokens;
    totalOutputTokens += response.usage.output_tokens;

    if (response.stop_reason === 'end_turn') {
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('');
      return { text: text || '...', inputTokens: totalInputTokens, outputTokens: totalOutputTokens };
    }

    if (response.stop_reason === 'tool_use') {
      const toolUseBlock = response.content.find(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
      );

      if (!toolUseBlock) break;

      const toolResult = getDetail((toolUseBlock.input as { topic: string }).topic);

      currentMessages = [
        ...currentMessages,
        { role: 'assistant' as const, content: response.content },
        {
          role: 'user' as const,
          content: [
            {
              type: 'tool_result' as const,
              tool_use_id: toolUseBlock.id,
              content: toolResult,
            },
          ],
        },
      ];
    }
  }

  return { text: '...', inputTokens: totalInputTokens, outputTokens: totalOutputTokens };
}

export async function POST(req: NextRequest) {
  let sessionId = '';

  try {
    const body = await req.json();
    sessionId = body.sessionId;
    const messages: Anthropic.MessageParam[] = body.messages;

    if (!sessionId || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const session = getSession(sessionId);

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

    const remaining = SESSION_BUDGET - session.totalCost;
    const maxTokens = remaining < (SESSION_BUDGET - SOFT_LIMIT) ? MAX_TOKENS_LOW : MAX_TOKENS_NORMAL;

    // Empty messages = greeting request. Send a minimal trigger message.
    const apiMessages = messages.length === 0
      ? [{ role: 'user' as const, content: '[visitor just opened the page]' }]
      : messages;

    const { text, inputTokens, outputTokens } = await callWithTools(apiMessages, maxTokens);

    const callCost = inputTokens * SONNET_INPUT_RATE + outputTokens * SONNET_OUTPUT_RATE;
    session.inputTokens += inputTokens;
    session.outputTokens += outputTokens;
    session.totalCost += callCost;

    return NextResponse.json({
      text,
      budgetExhausted: session.totalCost >= SESSION_BUDGET,
      usage: {
        callCost: callCost.toFixed(6),
        totalCost: session.totalCost.toFixed(6),
        remaining: Math.max(0, SESSION_BUDGET - session.totalCost).toFixed(6),
      },
    });
  } catch (err) {
    console.error('[chat route error]', err);
    const session = sessionId ? getSession(sessionId) : { totalCost: 0 };
    return NextResponse.json({
      text: '...',
      budgetExhausted: false,
      usage: {
        callCost: '0.000000',
        totalCost: session.totalCost.toFixed(6),
        remaining: Math.max(0, SESSION_BUDGET - session.totalCost).toFixed(6),
      },
    });
  }
}
