# MIUI Design System — Design Guidelines 2.0

## Overview
Led the upgrade of MIUI Design Guidelines from a fragmented, unreliable spec into a measurable, sustainable design system. The system serves tens of thousands of employees, dozens of departments, and 700-800 million users. Focused period: June 2022 (took over) to March 2023 (major milestone).

## Context
Inherited a guideline system that was mainly maintained by 1-2 people. Rules were hidden and scattered, content was incomplete and inaccurate, and people were reluctant to use it. The website wasn't updated regularly, Figma components had legacy bugs (large text / localization issues), and the person in charge had to act like customer service constantly answering questions. Many rules could only be confirmed by asking engineers directly -- the documentation didn't reflect reality.

## My Role
Assigned as the lead of the guideline upgrade. Reported directly to the System Design lead and the head of Xiaomi Design. This was entirely design-led -- no dedicated product manager existed for guidelines at Xiaomi. My manager joked: "We appointed a newcomer to lead a group of senior people and it also had to be cross-department. It just sounded very unreliable."

## Team
Started with me + 2 system designers. Later expanded to a 7-person guideline team (added 1 system designer + 3 app designers). Worked closely with 6 MIUI SDK engineers. Everyone was part-time -- half on their own product work, half on guidelines.

## What I Did

### Competitive research
Reviewed Apple, Google, and IBM design systems and compared with MIUI. Found massive gaps: color rules existed only as Figma Styles, dark mode had no system-level rules, components showed default UI only without documenting real constraints or interaction rules.

### User interviews + workshop
Interviewed 3 designers and 3 engineers with experience-based questions ("walk me through a recent time you used a component"). Then ran a 40-person workshop with system/app designers, UX researchers, and PMs. Used sticky-note activities to collect issues and needs at scale.

### Defined 4 core problems
After consolidating research, focused the yearly plan on 4 problems:
1. Lack of understanding -- people didn't know what MIUIX was or when to use components. Goal: build a MIUI knowledge base connected to engineering docs
2. Hard to find -- resources scattered across Figma, website, multiple platforms. Goal: rebuild Figma component library with clear linking
3. Incomplete guidelines -- no standard structure, missing key rules. Goal: standardize document and Figma framework, fill in essential content
4. Mismatch with production -- Figma and shipped results didn't align. Goal: partner with engineering to ensure consistency

### Created evaluation metrics
Discovered that "is the guideline usable" can be measured. Defined metrics across 5 dimensions:
- Comprehensive and reliable (scenarios, edge cases fully described)
- Easy to read and learn (clear explanations, examples, good layout)
- Customization boundary clearly stated (what's strict vs. flexible)
- Clear ownership mechanism (who to ask, where to report, change logs)
- Consistency across Figma, design docs, and engineering docs

### Pilot with dialog component
Rewrote the dialog guideline as a pilot using the structure learned from competitor research. Ran a small review with 3 designers, 3 PMs, 3 engineers. Turned evaluation metrics into a user-friendly survey.

### Large-scale validation
Invited 30 people (10 designers, 10 engineers, 10 PMs) to review the new dialog guideline and Figma. Satisfaction score: 8.9 out of 10. People said the content was clearer, more complete, and they learned things they didn't know before.

## Deliverables

### 1. Knowledge base
Created new guideline documents for 8 high-frequency components: button, switch, list, floating window, reach-friendly dialog, loading, empty state, input field. Each followed a standardized structure: links and overview, types and scenarios, anatomy, responsive rules, interaction rules, do's/don'ts, appendix with change log.

First-ever published foundation guidelines for color, typography, font sizes, and motion (with motion and typography team support).

Introduced design tokens with engineering: clarified system color behavior across states (default, pressed, hover, disabled).

### 2. Rebuilt Figma library
Restructured file organization with index page, separated components into clear pages. Reorganized foundation styles (color, typography, font sizes, corner radius) into unified foundation guideline. Re-laid out and filled in missing content for all Phase 1 components. Ran internal learning sessions on Figma Auto Layout and Variants to improve component quality.

## Results
- New guideline satisfaction: 8.9/10 (N=30, cross-functional)
- 8 component guidelines + foundation guidelines published
- Figma library restructured and adopted across MIUI product teams
- Evaluation framework established for long-term iterative improvement
- Team expanded from 3 to 7 people based on proven value
- Promoted to Senior UX Designer (Level 16) partly based on this work

## What I Learned
A design system is fundamentally a governance problem, not a component library problem. The hardest part wasn't designing components -- it was getting 10+ teams to trust and use the same standards. Making quality measurable (the evaluation metrics) was the turning point that convinced leadership to invest resources. Also learned that being a newcomer leading seniors requires constant evidence-based communication rather than authority.

## Can't Say
Cannot share internal Figma files, specific component specs, or detailed metrics beyond the 8.9/10 satisfaction score.

## Link
Case study page: xueyizhou.xyz/work/miui-design-system
