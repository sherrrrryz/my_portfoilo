# Ephemeral Chat — Backend Upgrade Guide

## Current State

Project is fully running. Frontend (global keyboard capture, character fading, split-screen layout, divider, typing simulation, interrupt, budget exhaustion) is complete.

**This upgrade focuses on backend changes. Frontend changes limited to: fade timing parameter + auto-greeting on page load. Do NOT modify layout, styles, or component structure.**

## Change Scope

5 tasks:

1. **Create** `app/data/` directory + project data files
2. **Create** `app/lib/tools.ts` tool definitions
3. **Replace** `app/api/chat/route.ts` (new model + new prompt + tool use loop)
4. **Modify** `app/chat/components/constants.ts`: CHAR_LIFETIME 5000 -> 10000
5. **Modify** `app/chat/styles/ephemeral.css`: fadeChar animation 5s -> 10s
6. **Modify** frontend mount logic: auto-greeting 1.5s after page load

## Architecture

```
app/
├── api/chat/route.ts           <- API Route: tool definitions + billing
├── data/
│   ├── projects/               <- One .md file per project
│   │   ├── miui-design-system.md
│   │   ├── xiaomi-lockscreen.md
│   │   ├── applovin-oobe.md
│   │   ├── linkly.md
│   │   ├── fiction-reading-app.md
│   │   ├── ephemeral-chat.md
│   │   └── portfolio-site.md
│   ├── background.md
│   └── philosophy.md
├── lib/
│   ├── anthropic.ts
│   └── tools.ts                <- Tool definitions + file reading logic
└── chat/
    └── components/
        ├── EphemeralChat.tsx
        ├── useAIEngine.ts
        ├── constants.ts
        └── ...
```

## Workflow

```
1. Visitor: "Tell me about your design system work at Xiaomi"
2. AI receives message, system prompt has project list, identifies MIUI Design System
3. AI calls tool: get_detail("miui-design-system")
4. Server reads app/data/projects/miui-design-system.md, returns content
5. AI responds using retrieved details + personality rules in Sherry's voice
```

Overview questions don't need tools:
```
1. Visitor: "What have you worked on?"
2. AI answers from system prompt project list directly, no tool call
3. "I've worked at Huawei, Xiaomi, and AppLovin -- want me to go deeper on any of them?"
```

## API Route Call Flow

Tool use means one conversation turn may produce multiple API roundtrips:

```
Frontend                    API Route                  Anthropic
 |                           |                          |
 |  POST { messages }        |                          |
 |  ---------------------->  |                          |
 |                           |  messages.create          |
 |                           |  (with tool definitions)  |
 |                           |  ---------------------->  |
 |                           |                          |
 |                           |  <-- stop_reason:         |
 |                           |       "tool_use"          |
 |                           |                          |
 |                           |  Read data file           |
 |                           |                          |
 |                           |  messages.create          |
 |                           |  (with tool_result)       |
 |                           |  ---------------------->  |
 |                           |                          |
 |                           |  <-- stop_reason:         |
 |                           |       "end_turn"          |
 |                           |                          |
 |  <-- { text, usage }      |                          |
```

Key points:
- Tool use happens **server-side**, frontend is unaware
- One visitor message may trigger 2 API calls (first returns tool_use, second returns text)
- Billing accumulates tokens from both calls
- Frontend only receives final text, experience unchanged

## Verification

Test these 5 scenarios after changes:

1. **Auto-greeting**: Refresh page -> 1.5s later AI starts typing a greeting
2. **Fade timing**: Text stays clear ~6s, begins fading, fully gone at 10s
3. **Simple question** (no tool): Type "what do you do" -> AI answers from system prompt
4. **Project deep-dive** (triggers tool): Type "tell me about miui" -> AI calls get_detail, answers with detail
5. **Budget exhaustion**: Chat until $1 spent -> returns budgetExhausted: true

## Do NOT

- Rewrite frontend layout, styles, or component structure (only change constants and mount logic)
- Use localStorage or sessionStorage
- Show any error messages (network error -> AI outputs "...")
- Use streaming API (use non-streaming, frontend simulates typing)
- Support Chinese or IME
- Support Backspace/Delete
- Add mobile adaptation (desktop-first)
- Expose API key on frontend (all AI calls through API Route)

## Confirmed Design Decisions

| Decision | Conclusion |
|----------|-----------|
| UI | Keep text fading, extend fade from 5s to **10s** |
| AI greeting | **Yes**, auto-greet 1.5s after page load |
| AI asks visitor identity | **Yes**, can politely ask to adjust response depth |
| max_tokens | **300-400** (up from 120) |
| Model | **Claude Sonnet 4** (project detail accuracy) |
| Budget | $1.00 per session |
