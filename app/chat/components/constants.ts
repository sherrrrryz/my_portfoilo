export const CHAR_LIFETIME = 10000;        // ms per character
export const FADE_START_RATIO = 0.6;       // start fading at 60%
export const CLEANUP_INTERVAL = 800;       // expired char cleanup interval ms
export const DOM_REMOVAL_DELAY = 20000;    // delay before removing chars from DOM (2x fade time)
export const PAUSE_THRESHOLD = 2200;       // pause detection threshold ms
export const SESSION_BUDGET = 1.0;         // session budget cap $
export const SOFT_LIMIT = 0.95;            // soft budget limit $
export const MAX_CONTEXT_TURNS = 12;       // context turns to keep
export const MAX_TOKENS_NORMAL = 120;      // normal max_tokens
export const MAX_TOKENS_LOW = 40;          // low-budget max_tokens

// typing simulation delays (ms)
export const TYPING_DELAY = {
  normal: [35, 75] as const,
  space: [50, 110] as const,
  comma: [80, 160] as const,
  period: [180, 400] as const,
  ellipsisDot: [120, 280] as const,
  newline: [300, 600] as const,
};

// visual
export const BG_COLOR = '#111111';
export const USER_TEXT_COLOR = '#e8e4df';
export const AI_TEXT_COLOR = '#c8d0d8';
export const DIVIDER_OPACITY_IDLE = 0.15;
export const DIVIDER_OPACITY_ACTIVE = 0.35;
export const CURSOR_BLINK_DURATION = 1.2; // seconds
