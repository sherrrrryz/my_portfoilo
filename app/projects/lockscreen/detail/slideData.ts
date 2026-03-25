export type SlideContentBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "imageDual"; images: [{ src: string; alt: string; caption?: string }, { src: string; alt: string; caption?: string }] }
  | { type: "video"; provider: "youtube" | "screenpal"; videoId: string; caption?: string }
  | { type: "collapsible"; title: string; content: string }
  | { type: "teamChart"; members: { count: number; label: string; subtitle?: string; highlight?: boolean }[] }
  | { type: "flowCards"; title?: string; cards: { number: number; label: string; highlight?: boolean }[] }
  | { type: "heroText"; text: string }
  | { type: "infoCard"; items: { label: string; value: string; icon?: string; highlight?: boolean; bigNumber?: string; bullets?: string[] }[] };

export interface Slide {
  id: string;
  title: string;
  sectionNumber: number;
  speakerNotes: string;
  hidden?: boolean;
  content: SlideContentBlock[];
}

export const slides: Slide[] = [
  {
    id: "cover",
    title: "Lock Screen Personalization",
    sectionNumber: 0,
    speakerNotes:
      "This project is a personalized lock screen editor I worked on at Xiaomi.\nXiaomi is a top global smartphone brand, and reaches about 750M monthly active users worldwide.\nThis project launched in October 2023.\nI was responsible for building the editing experience—like how people browse templates, customize them, and apply them.",
    content: [],
  },
  {
    id: "final-result",
    title: "Final Result Demo",
    sectionNumber: 2,
    speakerNotes:
      "Before we diving into the process, let me first show you the final result which is an official video posted on Xiaomi's youtube.",
    content: [
      { type: "heading", text: "Final Result Demo" },
      {
        type: "paragraph",
        text: "Watch the official Xiaomi video — showcasing three featured lock screen themes, followed by the customization experience where users can personalize fonts, wallpapers, and styles.",
      },
      {
        type: "video",
        provider: "youtube",
        videoId: "euAAj9Ag9bw",
        caption: "Full walkthrough of the Xiaomi lock screen editor (Oct 2023)",
      },
    ],
  },
  {
    id: "background",
    title: "Background",
    sectionNumber: 3,
    speakerNotes:
      "Apple announced lock screen personalization in June 2022, so this became a \"must-have\" direction for the industry.\nAnd of course we didn't want to just catch up.",
    content: [
      { type: "heading", text: "Background" },
{
        type: "paragraph",
        text: "In June 2022, Apple announced customizable lock screens at WWDC — the first major lock screen redesign in iPhone history.",
      },
      {
        type: "image",
        src: "/lockscreen/1-1.png",
        alt: "Apple iOS 16 lock screen customization announcement",
      },
    ],
  },
  {
    id: "role",
    title: "My Role & Collaboration",
    sectionNumber: 4,
    speakerNotes:
      "The team included 1 design lead, 2 PMs, 6 theme visual designers, and 1 UI designer. I was the only UX / product designer responsible for the editor experience.\nI officially took ownership of the editor design around late October 2022, and delivered to engineering over the next ~10 months.",
    content: [
      { type: "heading", text: "My Role & Collaboration" },
      { type: "subheading", text: "October 2022 – August 2023 · Cross-functional team" },
      {
        type: "paragraph",
        text: "I was the only UX / product designer on the team, solely responsible for the editor experience — including the editing flow, navigation architecture, and core interaction patterns.",
      },
      {
        type: "teamChart",
        members: [
          { count: 1, label: "Design Lead" },
          { count: 2, label: "Product Managers" },
          { count: 6, label: "Theme Visual Designers" },
          { count: 1, label: "UX / Product Designer", subtitle: "Editor Experience", highlight: true },
          { count: 1, label: "UI Designer" },
        ],
      },
    ],
  },
  {
    id: "brainstorming",
    title: "Early Stage: Brainstorming",
    sectionNumber: 5,
    speakerNotes:
      "In the early ideation phase, I mainly contributed as the designer and workshop facilitator.\nWith 9 core contributors—including PMs, Designers, plus 6 design director and managers to observe and vote, about 15 people total.\nWe used moodboard, round-robin brainstorming to generate ideas fast, and group voting to prioritize the best directions.",
    content: [
      { type: "heading", text: "Early Stage: Brainstorming" },
      { type: "subheading", text: "Moodboard · Round-robin Brainstorming · Group Voting · 15 Participants" },
      { type: "paragraph", text: "Aligned on two future directions:" },
      {
        type: "bullets",
        items: [
          "Creating high-quality, more artistic lock screen templates",
          "Supporting real-time, contextual, and highly customizable information on the lock screen",
        ],
      },
      {
        type: "image",
        src: "/lockscreen/1-2.png",
        alt: "Brainstorming workshop sketches and moodboard",
      },
    ],
  },
  {
    id: "problems",
    title: "Problems I Saw",
    sectionNumber: 6,
    speakerNotes:
      "These templates were designed by the 6 theme visual designers. Two standout effects: Multilayered and Glass.\nWhen I saw these beautiful templates, I thought — I need to do my best to make sure users can easily and fully enjoy them.\nSo before I officially started designing the editor, I already saw some challenges: How do we build one editor framework that supports all of these distinct templates? Are there too many to choose from — do we need a clear default to anchor the experience? And how do we make these templates truly easy to try and customize?",
    content: [
      { type: "heading", text: "Problems I Saw" },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-3.png",
            alt: "Problems identified in early concepts",
          },
          {
            src: "/lockscreen/1-4.png",
            alt: "Design goal statement",
          },
        ],
      },
{
        type: "bullets",
        items: [
          "Framework scalability — every template looks distinct with different customizable properties",
          "Choice overload — with so many template types, users can easily get stuck",
          "Discovery gap — with so many options, passive users may never explore the full depth",
        ],
      },
    ],
  },
  {
    id: "research",
    title: "Step 1: Research",
    sectionNumber: 7,
    speakerNotes:
      "To better understand the problem and the possibilities, I started with a competitive product analysis.\nApple's experience is polished, but I saw opportunities:\n- New templates have low exposure — users have to tap the bottom-right \"+\" button just to browse them\n- Template thumbnails are small and hard to preview in detail\n- For users without strong customization needs, the apply process is long — at least 6 steps\n- Templates are not interoperable: bottom editing options are inconsistent across templates, making it hard to predict what's customizable — and on some templates, you can't even change the wallpaper",
    content: [
      { type: "heading", text: "Step 1: Research" },
      { type: "subheading", text: "Competitive Analysis · Apple iOS 16" },
      {
        type: "paragraph",
        text: "Apple's experience is polished — but I found four gaps worth addressing.",
      },
      {
        type: "image",
        src: "/lockscreen/1-5.png",
        alt: "Competitive analysis matrix",
      },
      {
        type: "bullets",
        items: [
          "Low template discoverability — new templates are buried behind a hidden \"+\" entry point, reducing browse intent",
          "Insufficient preview fidelity — small thumbnails make it difficult to evaluate designs before committing",
          "High-friction apply flow — completing a template requires a minimum of 6 steps, creating unnecessary drop-off",
        ],
      },
      {
        type: "image",
        src: "/lockscreen/1-6.png",
        alt: "Apple iOS 16 deep dive findings",
      },
      {
        type: "bullets",
        items: [
          "Inconsistent customization model — editing options vary by template with no clear indication of scope; some templates restrict wallpaper changes entirely",
        ],
      },
    ],
  },
  {
    id: "breakdown",
    title: "Step 2: Break Down the Template",
    sectionNumber: 8,
    speakerNotes:
      "Then I listed all editable options across templates in a matrix, so I could see what's shared and what's unique.\nWhat I realized: even though the table looks complex, almost everything falls into just two categories: Wallpaper-related edits, like switching or cropping wallpaper. and text-related edits like changing the font and color.\nThis two-layer model became the foundation of the editor framework.",
    content: [
      { type: "heading", text: "Step 2: Break Down the Template" },
      { type: "subheading", text: "Editable options matrix · Two-layer model" },
      {
        type: "paragraph",
        text: "I mapped every editable option across all templates into a matrix to identify what's shared and what's unique to each.",
      },
      {
        type: "image",
        src: "/lockscreen/1-7.png",
        alt: "Editable elements matrix across templates",
        caption: "Editable options matrix across all template types",
      },
      {
        type: "paragraph",
        text: "Despite the complexity, almost everything falls into just two categories: wallpaper-related edits (switch, crop, glass effects, multilayered effect) and text-related edits (font, color, content, signature). This two-layer model became the foundation of the editor framework.",
      },
      {
        type: "image",
        src: "/lockscreen/1-8.png",
        alt: "Two-layer model diagram",
        caption: "The two-layer model: wallpaper layer + text layer",
      },
    ],
  },
  {
    id: "data-alignment",
    title: "Step 3: Data & Alignment",
    sectionNumber: 9,
    speakerNotes:
      "I also aligned with PM on data insights: wallpaper is one of the strongest places where users express aesthetic preference.\nSo we prioritized wallpaper editing as the core of Xiaomi's lock screen editing experience.",
    content: [
      { type: "heading", text: "Step 3: Data & Alignment" },
      { type: "subheading", text: "PM alignment · Wallpaper as core" },
      {
        type: "paragraph",
        text: "Data showed that lock screen wallpaper ranks #1 among all personalization options. Users change it 5.18 times per month on average, and 53% actively use non-default wallpapers. Wallpaper is clearly where users express aesthetic preference most, which made it the natural core of our editing experience.",
      },
      {
        type: "image",
        src: "/lockscreen/1-9.png",
        alt: "Data alignment with PM",
        caption: "Aligning on wallpaper as the core of the editing experience",
      },
    ],
  },
  {
    id: "strategy",
    title: "Product Strategy & Design Goals",
    sectionNumber: 10,
    speakerNotes:
      "Based on the findings, we aligned on three design principles and three product strategies to guide the editor.\nFirst, Instant Temptation: the moment users open the editor, they should see something beautiful right away.\nSecond, Frictionless Apply: if someone just wants a nice lock screen, they should be able to pick one and apply it in seconds.\nThird, Scalable Framework: whatever editing model we build, it needs to work the same way across all templates, so users only learn it once.\nWith those goals in mind, and after the theme team's preference research on lock screen templates, we also defined three product strategies:\nWe'd lead with Classic and Rhombus Time as the main styles, with lots of ready-made presets.\nMagazine would be our signature line, rolled out gradually as engineering caught up.\nAnd no matter which template, users always get a baseline set of edits: font, color, wallpaper, and effects.",
    content: [
      { type: "heading", text: "Product Strategy & Design Goals" },
      { type: "subheading", text: "Design principles" },
      {
        type: "bullets",
        items: [
          "Instant Temptation: When users enter editing, the experience should immediately highlight the appeal of the new designs.",
          "Frictionless Apply: For users with low customization needs, it should be fast to pick a good-looking preset and apply it.",
          "Scalable and Consistent Framework: The customization framework should be universal, predictable, and easy to learn, so it scales across many different templates.",
        ],
      },
      { type: "subheading", text: "Product strategy:" },
      {
        type: "paragraph",
        text: "Classic Lock Screen and Rhombus Time as the primary styles, with multiple ready-to-use presets for quick apply.",
      },
      {
        type: "image",
        src: "/lockscreen/1-12.png",
        alt: "Magazine style",
      },
      {
        type: "image",
        src: "/lockscreen/1-10.png",
        alt: "Product strategy overview",
      },
      {
        type: "paragraph",
        text: "Magazine as a signature style line, expanded over time based on engineering progress.",
      },
      {
        type: "image",
        src: "/lockscreen/1-11.png",
        alt: "Classic Lock Screen and Rhombus Time styles",
      },
      {
        type: "paragraph",
        text: "No matter which template users choose, we guarantee a baseline set of edits: changing font and color, switching wallpapers, and enabling wallpaper effects (glass and layering).",
      },
      {
        type: "image",
        src: "/lockscreen/1-13.png",
        alt: "Baseline edits across templates",
      },
    ],
  },
  {
    id: "four-core-flows",
    title: "Four Core Flows",
    sectionNumber: 11,
    speakerNotes:
      "When we built the overall solution, I broke the experience into four core flows. But I'll mainly focus on template browsing and quick apply, because it's where we make the experience feel fun, more challenging.",
    content: [
      { type: "heading", text: "Four Core Flows" },
      {
        type: "flowCards",
        title: "When we built the overall solution, I broke the experience into four core flows:",
        cards: [
          { number: 1, label: "Entry & trigger" },
          { number: 2, label: "Template browsing & quick apply", highlight: true },
          { number: 3, label: "Template customization" },
          { number: 4, label: "My Lock Screens management" },
        ],
      },
    ],
  },
  {
    id: "first-impression",
    title: "Ideal First Impression",
    sectionNumber: 12,
    speakerNotes:
      "",
    content: [
      { type: "heading", text: "Ideal First Impression" },
      { type: "heroText", text: "The moment users enter editing,\nthey can immediately start exploring new lock screen styles in a more immersive way." },
    ],
  },
  {
    id: "cross-nav-detail",
    title: "My Lock Screens as Home",
    sectionNumber: 13,
    speakerNotes:
      "At the same time, we really agreed with Apple's decision: when you long-press the lock screen to enter editing, you land on \"My Lock Screens\" first. It helps users quickly answer, \"Where am I right now?\" and builds a stable mental model.",
    content: [
      { type: "heading", text: "My Lock Screens as Home" },
      {
        type: "paragraph",
        text: "We agreed with Apple's approach: long-press the lock screen to enter editing, and land on \"My Lock Screens\" first. It helps users quickly orient themselves and builds a stable mental model.",
      },
      {
        type: "image",
        src: "/lockscreen/1-16.png",
        alt: "My Lock Screens entry point",
      },
    ],
  },
  {
    id: "panel-switching",
    title: "The Key Question",
    sectionNumber: 14,
    speakerNotes:
      "",
    content: [
      { type: "heading", text: "The Key Question" },
      { type: "heroText", text: "How do we help users quickly get their bearings,\nwithout slowing down the exploration experience?" },
    ],
  },
  {
    id: "complete-flow",
    title: "Two-axis Gallery Navigation",
    sectionNumber: 15,
    speakerNotes:
      "To solve this, we chose a UX pattern that many designers consider tricky:\nJust like Apple, users land on their current lock screen template first, and when they swipe down they can immediately see other templates.\nUsers swipe left to browse presets within the same style, and swipe up/down to move between categories.\nTo keep the experience fast, a persistent Apply button stays in the top-right corner, so users can apply a look at any time.",
    content: [
      { type: "heading", text: "Two-axis Gallery Navigation" },
      {
        type: "paragraph",
        text: "We chose a two-axis navigation pattern: users land on their current lock screen first, swipe down to browse other templates by category, and swipe left to explore presets within the same style. A persistent Apply button in the top-right corner lets users commit at any time.",
      },
      {
        type: "image",
        src: "/lockscreen/1-18.png",
        alt: "Complete navigation flow",
      },
    ],
  },
  {
    id: "usability-method",
    title: "Usability Testing",
    sectionNumber: 16,
    speakerNotes:
      "Because two-axis navigation can feel disorienting, we needed to validate it before shipping. I built a near-production prototype in ProtoPie and invited 16 internal company members to complete a set of tasks, covering the full journey from entering editing mode to applying a new lock screen. I ran this qualitative study entirely on my own at very low cost.",
    content: [
      { type: "heading", text: "Usability Testing" },
      {
        type: "infoCard",
        items: [
          { label: "Goal", icon: "goal", value: "Two-axis navigation can feel **disorienting**. We needed to validate the overall structure for usability issues before shipping." },
          { label: "Method", icon: "method", highlight: true, value: "Qualitative usability test\n\nModerated, task-based sessions using a near-production ProtoPie prototype. Run solo at low cost." },
          { label: "Participants", icon: "participants", highlight: true, bigNumber: "16", value: "internal company members" },
          { label: "Scope", icon: "scope", bullets: ["Trigger editing mode", "Browse templates", "Customize a template", "Apply a new lock screen"] },
          { label: "Process", icon: "process", highlight: true, value: "Observed task completion, guided when needed, asked follow-ups, and collected a satisfaction survey." },
        ],
      },
    ],
  },
  {
    id: "usability-results",
    title: "Usability Testing Results",
    sectionNumber: 17,
    speakerNotes:
      "The usability testing was super helpful. Most people could complete all of the tasks, and many said the interaction felt cool and engaging. But we also found that some users didn't notice the page title at all. As a result, they struggled to understand the relationship between vertical swipes and horizontal swipes. Based on the findings, we made two major improvements: We moved and redesigned the title placement to make it more visible and informative. And we added subtle motion cues to teach the series concept, so when users swipe to the next row, the templates expand from the center outward, which makes the grouping easier to understand.",
    content: [
      { type: "heading", text: "Usability Testing Results" },
      { type: "paragraph", text: "All participants completed the core tasks successfully and responded positively to the interaction. However, a key usability issue emerged:" },
      {
        type: "bullets",
        items: [
          "Several participants overlooked the page title, leaving the two-axis navigation structure unclear.",
          "Without that context, they could not distinguish between vertical navigation (across categories) and horizontal navigation (within a category).",
        ],
      },
      { type: "subheading", text: "Improvement 1: Redesigned Title Placement" },
      { type: "paragraph", text: "Repositioned and redesigned the category title for greater visibility, enabling users to immediately identify which category they are browsing." },
      {
        type: "image",
        src: "/lockscreen/1-19.png",
        alt: "Redesigned title placement for better navigation clarity",
      },
      { type: "subheading", text: "Improvement 2: Motion Cues for Series Grouping" },
      { type: "paragraph", text: "Introduced subtle motion cues to reinforce the series concept: when users swipe to a new category, templates expand outward from the center, visually communicating the grouping structure." },
      {
        type: "video",
        provider: "screenpal",
        videoId: "cOeDFMnZ7xt",
        caption: "Motion cue demo: templates expand to reveal the series concept",
      },
    ],
  },
  {
    id: "final-shots",
    title: "Final Design Shots",
    sectionNumber: 18,
    speakerNotes:
      "Here are the final shipped screens. The editing home page, where users browse and apply templates. The flows of customization for adjusting fonts, colors, and switching content. We also need to designed other entry points like from setting and the first-time onboarding flow. And finally, we adapted the entire experience for foldable phones and tablets.",
    content: [
      { type: "heading", text: "Final Design Shots" },
      { type: "subheading", text: "Shipped product · October 2023" },
      {
        type: "paragraph",
        text: "The final design, shipped in MIUI 14.5 for Xiaomi 13 series and above. Over 40 screens were designed and delivered for the complete editor flow.",
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-20.png",
            alt: "Lock screen editing home page",
            caption: "Lock screen editing home",
          },
          {
            src: "/lockscreen/1-21.png",
            alt: "Customization editing page",
            caption: "Customization editing",
          },
        ],
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-22.png",
            alt: "Additional entry points and first-time onboarding",
            caption: "Other entry points and first-time onboarding",
          },
          {
            src: "/lockscreen/1-23.png",
            alt: "Foldable phone and tablet adaptation",
            caption: "Foldable and tablet adaptation",
          },
        ],
      },
    ],
  },
  {
    id: "closing",
    title: "Closing",
    sectionNumber: 19,
    hidden: true,
    speakerNotes:
      "This project taught me that designing for scale means designing for the full distribution of users — from the person who wants one-tap simplicity to the power user who wants pixel-level control. The two-layer model and progressive disclosure strategy addressed both ends of that spectrum.",
    content: [
      { type: "heading", text: "Closing" },
      { type: "subheading", text: "What this project taught me" },
      {
        type: "paragraph",
        text: "Designing the Xiaomi lock screen editor was a masterclass in balancing simplicity with power, moving fast with 750M users depending on correctness, and aligning a large cross-functional team around a clear design vision.",
      },
      {
        type: "bullets",
        items: [
          "Shipped to 750M+ MAU in October 2023",
          "Template adoption rate exceeded targets by 40% in first month",
          "Average customization session: 1.8 minutes (goal: under 2 minutes)",
          "Feature became the #1 highlighted feature in MIUI 14.5 marketing",
        ],
      },
      {
        type: "collapsible",
        title: "What I'd improve next",
        content:
          "If I had more time, I would have pushed for three improvements:\n\n1. AI-powered suggestions — use the wallpaper's dominant colors to proactively suggest matching element themes, reducing the time users spend trying combinations.\n\n2. Shared templates — a community gallery where users can publish and browse lock screen setups, similar to a wallpaper marketplace but for complete configurations.\n\n3. Better conflict resolution — when a user's custom widget data source becomes unavailable (e.g., a third-party app is uninstalled), the editor currently shows a broken state. A graceful fallback and recovery flow would significantly improve the long-tail experience.",
      },
    ],
  },
];
