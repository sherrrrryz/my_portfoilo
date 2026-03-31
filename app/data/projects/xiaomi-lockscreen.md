# Xiaomi Lock Screen — Personalized Lock Screen Editor

## Overview
A personalized lock screen editor for Xiaomi smartphones, letting users browse, customize, and apply lock screen templates. Launched October 2023. Xiaomi reaches about 750 million monthly active users worldwide.

## Context
Apple announced lock screen personalization in June 2022, making it a must-have direction for the industry. Xiaomi didn't want to just catch up -- the goal was to create a distinctive, high-quality experience with artistic templates and deep customization.

## My Role
The only UX/product designer responsible for the entire editor experience -- how people browse templates, customize them, and apply them. Took ownership in late October 2022, delivered to engineering over roughly 10 months.

## Team
1 design lead, 2 PMs, 6 theme visual designers, 1 UI designer, and me as the sole UX designer for the editor.

## What I Did

### Early ideation
Facilitated a design workshop with about 15 people (9 core contributors plus 6 directors/managers observing and voting). Used moodboards, round-robin brainstorming, and group voting. Output: aligned on two future directions -- high-quality artistic templates and real-time contextual lock screen information.

### Research and competitive analysis
Analyzed Apple's lock screen editor and identified opportunities:
- New templates had low discoverability (hidden behind a small add button)
- Template preview images were too small to appreciate details
- For users without customization needs, the apply flow was too long (at least 6 steps)
- Templates were not interoperable -- inconsistent editing options, couldn't change wallpaper on some templates

### Template decomposition
Built a matrix of all editable options across all template types to find what's shared vs. unique. Key insight: despite apparent complexity, almost all editable options fall into just two categories -- wallpaper-related edits (switching, cropping) and text-related edits (font, color). This two-layer model became the foundation of the editor framework.

### Data alignment with PM
Wallpaper editing identified as the strongest expression of user aesthetic preference. Prioritized wallpaper editing as the core of the experience.

### Design principles and product strategy
Three design principles:
1. Instant Temptation -- entering the editor should immediately showcase the appeal of new designs
2. Frictionless Apply -- fast to pick a good preset and apply it for low-customization users
3. Scalable and Consistent Framework -- universal, predictable editing framework that scales across many templates

Three product strategies:
1. Classic Lock Screen and Rhombus Time as primary styles with multiple ready-to-use presets
2. Magazine as a signature style line, expanded over time based on engineering progress
3. Every template guarantees a baseline set of edits: change font/color, switch wallpapers, enable wallpaper effects (glass and layering)

### Key design decision: cross-axis navigation
Broke the experience into four core flows: template browsing, quick apply, customization, and wallpaper editing. Focused most design effort on template browsing and quick apply.

The challenge: users need to see both "where I am" (my current lock screen) and "what I can explore" (new templates). Following Apple's approach, users land on "My Lock Screens" first via long-press, then can explore.

Solution: two-axis swipe navigation. Users swipe left to browse presets within the same style, swipe up/down to move between categories. A persistent Apply button in the top-right corner enables instant apply at any point.

### Usability testing
Built a near-production prototype in ProtoPie. Recruited 16 random internal company members. Ran the qualitative study entirely on my own at very low cost. Tasks covered the full journey from entering editing mode to applying a new lock screen.

Results: most people completed key tasks, many said the interaction felt cool and engaging. But found critical confusion points -- users missed the page title, so the two-axis navigation wasn't obvious. They couldn't understand the relationship between vertical and horizontal swipes.

### Iteration based on testing
Two major improvements:
1. Moved and redesigned the title placement for better visibility and informativeness
2. Added subtle motion cues -- when swiping to a new category row, templates expand from center outward, making the grouping easier to understand

### Additional design work
- Lightweight info editing: change content, font, and color with instant preview
- Multiple entry points plus a first-time guide to help users start exploring
- Responsive layout optimized for foldables and tablets with large previews

## Results
- Shipped October 2023 as part of a major MIUI update
- Official launch video posted on Xiaomi's YouTube channel
- Promoted to Senior UX Designer (Level 16) -- partly based on this work

## What I Learned
Two-axis navigation is risky but can work if you invest in proper signposting and motion cues. The usability testing was critical -- without it, we would have shipped a confusing experience. Also learned that building a unified editor framework for diverse template types is fundamentally a categorization problem, not a UI problem.

## What I'd Improve Next
1. Make templates more connected -- let users mix wallpaper layers and info layers across templates, instead of being locked into one structure
2. Better full-screen preview with a clear Apply button for more confidence
3. Use subtle motion as navigation guidance, not just decoration

## Can't Say
Internal metrics, adoption rates, and unreleased template specs are under NDA. Can share the process, design decisions, and general outcomes.

## Link
Case study page: xueyizhou.xyz/work/xiaomi-lockscreen
