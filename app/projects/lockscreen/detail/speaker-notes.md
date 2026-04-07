# Lock Screen Personalization — Speaker Notes

## Section 0: Cover

Xiaomi · 750M MAU · Launched October 2023

This project is called Lock Screen Personalization Editing, which is a project I worked on at Xiaomi.
Xiaomi is a top global smartphone company, and reaches about 750M monthly active users worldwide.
In this project, I was responsible for building the editing experience—like how people browse templates, customize them, and apply them.

## Section 1: Background

Apple announced lock screen personalization in June 2022, so this became a "must-have" direction for the industry.
And of course we didn't want to just catch up.

## Section 2: My Role & Collaboration

The team included 1 design lead, 2 product managers, 6 theme visual designers, and 1 UI designer. I was the only UX or product designer responsible for the editor experience.
I officially took ownership around late October 2022, and delivered to engineering over the next 10 months.

## Section 3: Early Stage: Brainstorming

In the early ideation phase, I mainly contributed as the designer and workshop facilitator.
We used moodboard, round-robin brainstorming to generate ideas fast, and group voting to prioritize the best directions.
And we aligned on two future directions:
Creating high-quality, more artistic lock screen templates.
Supporting real-time, contextual, and highly customizable information on the lock screen.

## Section 4: Problems I Saw

These templates were designed by the 6 theme visual designers.
And they also brought out two wallpaper effects: Multilayered effect and Glass effect.
When I saw these beautiful templates, I thought — I need to do my best to make sure users can easily and fully enjoy them.
So before I actually started designing the editor, I already saw some challenges: How do we build one editor framework that supports all of these distinct templates? Are there too many to choose from — do we need a clear default to anchor the experience? And how do we make these templates truly easy to try and customize?

## Section 5: Step 1: Research

To better understand the problem and the possibilities, I started with a competitive product analysis. Apple's experience is polished, but I saw a few opportunities.
First, new templates have low exposure. Users have to tap the bottom-right "+" button just to browse them.
And as you can see, template thumbnails are small and hard to preview in detail.
For users without strong customization needs, the apply process is long, at least 6 steps.
And lastly, templates feel siloed. Each template only lets you pick from a fixed set of wallpaper, not freely switch to any wallpaper you want. That's why the bottom editing options are inconsistent across templates.

## Section 6: Step 2: Break Down the Template

Then I listed all editable options across templates in a matrix, so I could see what's shared and what's unique.
What I realized: even though the table looks complex, almost everything falls into just two categories: Wallpaper-related edits, such as switching or cropping wallpaper. and text-related edits such as changing the font and color.
This two-layer model became the foundation of the editor framework.

## Section 7: Step 3: Data & Alignment

I also aligned with PM on data insights: wallpaper is one of the strongest places where users express aesthetic preference.
So we prioritized wallpaper editing as the core of Xiaomi's lock screen editing experience.

## Section 8: Product Strategy & Design Goals

Based on the findings, we aligned on three design principles and three product strategies to guide the editor.
First, Instant Temptation: the moment users open the editor, they should see something beautiful right away.
Second, Frictionless Apply: if someone just wants a nice lock screen, they should be able to pick one and apply it in seconds.
Third, Scalable Framework: whatever editing model we build, it needs to work the same way across all templates, so users only learn it once.
With those goals in mind, we also defined three product strategies:
Classic Lock Screen and Rhombus Time as the primary styles, with multiple ready-to-use presets for quick apply.
Magazine as a signature style line, expanded over time based on engineering progress.
And no matter which template, users always get a baseline set of edits: font, color, wallpaper, and effects.

## Section 9: Four Core Flows

About the overall designs, I broke the experience into four parts. But I'll mainly focus on template browsing and quick apply, because it's where we make the experience feel fun, more challenging.

## Section 10: Ideal First Impression

The ideal first impression is that, the moment users enter editing, they can immediately start exploring new lock screen styles in a more immersive way.

## Section 11: My Lock Screens as Home

At the same time, we really agreed with Apple's decision: when you long-press the lock screen to enter editing, you land on "My Lock Screens" first. It helps users quickly answer, "Where am I right now?" and builds a stable mental model.

## Section 12: The Key Question

And the key question became:
How do we help users quickly get their bearings, without slowing down the exploration experience?

## Section 13: Two-axis Gallery Navigation

To solve this, we chose a UX pattern that many designers consider tricky:
So first, just like Apple, users land on their current lock screen template first, and when they swipe down they can immediately see other templates.
Users swipe left to browse presets within the same style, and swipe up or down to move between different styles.
And a persistent Apply button stays in the top-right corner, so users can apply in seconds.

## Section 14: Usability Testing

Because two-axis navigation can feel disorienting, we needed to validate it before shipping. I built a near-production prototype in ProtoPie and invited 16 internal company members to complete a set of tasks, covering the full journey from entering editing mode to applying a new lock screen. I ran this qualitative study entirely on my own at very low cost.

## Section 15: Usability Testing Results

The usability testing was super helpful. Most people could complete all of the tasks, and many said the interaction felt cool and engaging. But we also found that some users didn't notice the page title at all. As a result, they struggled to understand the relationship between vertical swipes and horizontal swipes. Based on the findings, we made two major improvements: We moved and redesigned the title placement to make it more visible and informative. And we added subtle motion cues to teach the series concept, so when users swipe to the next row, the templates expand from the center outward, which makes the grouping easier to understand.

## Section 16: Final Design Shots

Here are the final shipped screens. The editing home page, where users browse and apply templates. The flows of customization for adjusting fonts, colors, and switching content. We also need to designed other entry points like from setting and the first-time onboarding flow. And finally, we adapted the entire experience for foldable phones and tablets.

## Section 17: Closing

This project taught me that designing for scale means designing for the full distribution of users — from the person who wants one-tap simplicity to the power user who wants pixel-level control. The two-layer model and progressive disclosure strategy addressed both ends of that spectrum.

## Section 18: Post-Launch Video

Before we wrap up, here's the official video Xiaomi posted after launch, showcasing the final lock screen experience.
