# AppLovin OOBE — App Recommendation Experience in Android Setup

## Overview
Optimized the app discovery and installation funnel within Android's out-of-box experience (OOBE). Ran a series of progressive A/B experiments to increase engagement depth and completed installs while keeping OOBE friction minimal. The SDK was deployed with major partners including Samsung and T-Mobile, reaching tens of millions of new-device users.

## Context
More non-gaming app advertisers were joining, increasing supply -- but in OOBE users are in a rush and don't want to browse. It's a cold-start problem: on a new device there are almost no preference signals, so recommendations often missed. Installs stayed low, and behavioral signals suggested post-install opens were likely low too. We needed to collect lightweight preference signals fast, then use faster, lower-effort interactions to improve discovery and decision efficiency.

## My Role
Product Designer. Focused on hands-on experience design -- turning goals into concrete flows and interactions, iterating based on experiment results. Worked most closely with a Data Analyst on metrics and funnel insights, and with Engineers to ship and validate. The Design Lead handled strategic context and partner alignment with Business Development.

## Baseline Flow
Users see an opt-in page (Continue or Not now) then a recommendation page with "Favorite apps" and "Recommended apps" sections (some pre-selected by default) then a Done page. Most users tapped Continue quickly and didn't review pre-selected apps.

Key constraint: partners (Samsung) didn't want tests to disrupt OOBE, so every added step had to be optional and skippable.

## Experiments I Ran

### Experiment 1: 5-Step Preference Survey
Designed a 5-page deep survey as an intent filter to solve the cold-start problem.
- Surprisingly, 55% of users completed the entire 5-step journey despite the length -- proving OOBE users want relevance, not just speed
- Category sequence testing: leading with Social apps on the first page showed that once users clear step 1, subsequent page conversion surges to over 93%. First-screen value alignment is key
- High-intent users achieved a net lift of 0.21 clicks per user, driving 4.1% increase in overall distribution
- Quality insight: control group installs were mostly passive acceptance of pre-selected defaults; experimental group clicks were active decisions after 5 interactions -- much higher intent quality

### Experiment 2: 1-Page Short Survey
Compressed the 5 pages into 1 page to test if shorter = better.
- Completion rate jumped from 55% to over 80%
- But install contribution only grew 14%, lower than the 5-step version's 18%
- Proved that "too short" reduces engagement. The 5-step version builds psychological warm-up through progressive interaction
- Key learning: "Meaningful Friction" outperforms pure speed in OOBE. Kept the 5-step version

### Experiment 3: One-Click Bundle
Designed two bundle approaches to reduce decision-making:
- Exp 182 (Clean/collapsed): minimalist design, "Download All" button
- Exp 183 (Transparent/icons exposed): all app icons visible inside bundle
- Transparency won: Exp 183 achieved 0.47 net lift vs 0.37 for Exp 182, with 10.6% total distribution increase
- The collapsed version created a "blind box" effect -- users couldn't see what they'd download, which increased uncertainty
- Bundle captured most installs (75% CTR in Exp 183), but diluted subsequent page value -- later pages saw lower CTR due to longer flow and download queue congestion
- Identified downstream bottleneck: install completion limited by system/network speeds, not just UI design

### Experiment 4: Tinder-Style Swipe Cards
Introduced mandatory swipe interaction -- users must swipe through cards before exit button becomes available.
- Exp 202: must swipe 3 cards. Exp 203: must swipe 10 cards
- CTR reached 13.52% (3-card) and 15.65% (10-card) -- massive jump
- Broke the "blind skip" habit: forced interaction converted lost attention into real clicks
- Proved that "hard immersive interaction" outperforms "free exploration" for driving distribution in this context

## Core Metrics Framework
Four metric dimensions tracked across all experiments:
- Completion Rate: measures flow friction and user acceptance
- CTR / Time on Page / Scroll Depth: measures engagement quality -- "meaningful looking" vs "blind skipping"
- CIPEU (Completed Installs Per Engaged User): core quality metric, measures active intent
- Net Lift / Uplift: business impact, ensures statistically significant growth in overall distribution

## Results
- Progressive experiment ladder drove measurable uplift at each step
- Business contributed millions of dollars in quarterly revenue
- Built a complete distribution system from intent capture to efficient decision-making
- Later iterations combined Bundle + Swipe models, optimized survey options based on advertiser distribution, and created deeper sub-categories for games (primary ad category)

## What I Learned
"Meaningful Friction" is real -- in time-pressured contexts, adding purposeful interaction steps outperforms removing them. Transparency beats minimalism when users need to trust what they're committing to. And the biggest lesson: a design that looks clean on screen can fail if it creates cognitive uncertainty.

## Can't Say
Screens, copy, app lists, and absolute numbers shown in portfolio are sanitized placeholders. Only the uplift percentages and multipliers reflect real experimental results. Cannot share partner-specific data, raw metrics, or internal experiment details beyond what's described here.

## Link
Case study page: xueyizhou.xyz/work/applovin-oobe
