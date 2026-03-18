export type SlideContentBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "imageDual"; images: [{ src: string; alt: string; caption?: string }, { src: string; alt: string; caption?: string }] }
  | { type: "video"; provider: "youtube" | "screenpal"; videoId: string; caption?: string }
  | { type: "collapsible"; title: string; content: string };

export interface Slide {
  id: string;
  title: string;
  sectionNumber: number;
  speakerNotes: string;
  content: SlideContentBlock[];
}

export const slides: Slide[] = [
  {
    id: "cover",
    title: "Lock Screen Personalization",
    sectionNumber: 0,
    speakerNotes:
      "Open with the scale: 750 million monthly active users means this feature touched more people than the population of Europe. Launched in October 2023, the Xiaomi lock screen editor was one of the most ambitious personalization features in MIUI history.",
    content: [],
  },
  {
    id: "final-result",
    title: "Final Result Demo",
    sectionNumber: 2,
    speakerNotes:
      "Before diving into the process, let's see what we built. This demo video walks through the complete lock screen editing experience — from entering the editor to applying a custom theme.",
    content: [
      { type: "heading", text: "Final Result Demo" },
      {
        type: "paragraph",
        text: "Watch the complete lock screen editor experience — from entering edit mode to customizing widgets, fonts, and wallpapers, then applying the final look.",
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
      "Apple's WWDC 2022 announcement of customizable lock screens changed the competitive landscape overnight. Every Android OEM needed to respond, and Xiaomi was positioned to go further than Apple by leveraging its ecosystem advantages.",
    content: [
      { type: "heading", text: "Background" },
      { type: "subheading", text: "The industry moment that changed everything" },
      {
        type: "paragraph",
        text: "In June 2022, Apple announced customizable lock screens at WWDC — the first major lock screen redesign in iPhone history. The industry took notice.",
      },
      {
        type: "bullets",
        items: [
          "Apple iOS 16: first customizable lock screen in iPhone history",
          "Widgets, fonts, and photo depth effects set a new standard",
          "Android OEMs were pressured to respond with comparable experiences",
          "Xiaomi's MIUI had 750M+ MAU — a platform with unique scale advantages",
          "Opportunity: go beyond Apple with deeper customization and ecosystem integration",
        ],
      },
      {
        type: "image",
        src: "/lockscreen/1-1.png",
        alt: "Apple iOS 16 lock screen customization announcement",
        caption: "Apple's WWDC 2022 announcement set the competitive context",
      },
    ],
  },
  {
    id: "role",
    title: "My Role & Collaboration",
    sectionNumber: 4,
    speakerNotes:
      "This was a true cross-functional effort. I was the lead designer for the editor UX, working alongside two other designers who handled the template library and widget design. The 10-month timeline from October 2022 to launch was aggressive for a feature of this complexity.",
    content: [
      { type: "heading", text: "My Role & Collaboration" },
      { type: "subheading", text: "10-month timeline · Cross-functional team" },
      {
        type: "paragraph",
        text: "I was the lead UX designer for the lock screen editor interaction model, responsible for the editing flow, navigation architecture, and core interaction patterns.",
      },
      {
        type: "bullets",
        items: [
          "Lead designer: editor UX, navigation model, interaction design",
          "Collaborated with 2 designers on template library and widget system",
          "Partnered with 1 PM for strategy alignment and feature prioritization",
          "Worked with engineering team of 8 across Android and MIUI platform",
          "Timeline: October 2022 brief → October 2023 launch (10 months)",
          "Presented to VP of MIUI Design at 3 major review milestones",
        ],
      },
    ],
  },
  {
    id: "brainstorming",
    title: "Early Stage: Brainstorming",
    sectionNumber: 5,
    speakerNotes:
      "We ran a structured two-day workshop with the full design team to explore the possibility space. From moodboards to concept sketches, we crystallized two distinct future directions that would shape the rest of the project.",
    content: [
      { type: "heading", text: "Early Stage: Brainstorming" },
      { type: "subheading", text: "Workshop · Moodboard · 2 Future Directions" },
      {
        type: "paragraph",
        text: "We began with a structured brainstorming workshop — broad exploration before any constraints were applied. The goal was to understand what 'lock screen personalization' could mean at its most ambitious.",
      },
      {
        type: "bullets",
        items: [
          "2-day design workshop with full team",
          "Competitive moodboard: Apple, Samsung One UI, HyperOS early concepts",
          "User interview synthesis: what do people actually want to change?",
          "Direction A: Template-first — curated presets with limited customization",
          "Direction B: Modular editor — granular control over every element",
        ],
      },
      {
        type: "image",
        src: "/lockscreen/1-2.png",
        alt: "Brainstorming workshop sketches and moodboard",
        caption: "Brainstorming: two future directions",
      },
    ],
  },
  {
    id: "problems",
    title: "Problems I Saw",
    sectionNumber: 6,
    speakerNotes:
      "Even in the early excitement, I identified four systemic risks that could undermine the product. Surfacing these early — before we committed to a direction — was one of the most impactful contributions I made to the project.",
    content: [
      { type: "heading", text: "Problems I Saw" },
      { type: "subheading", text: "4 risks identified · Design goal statement" },
      {
        type: "paragraph",
        text: "Before we built anything, I stepped back to articulate the risks I saw in both directions. These became the foundation for our design goals.",
      },
      {
        type: "bullets",
        items: [
          "Risk 1: Feature overwhelm — too many options create decision paralysis",
          "Risk 2: Incoherence — user combinations look ugly, hurting brand perception",
          "Risk 3: Discoverability — if users can't find features, they don't exist",
          "Risk 4: Apply vs. preview confusion — unclear when changes take effect",
        ],
      },
      { type: "subheading", text: "Design Goal Statement" },
      {
        type: "paragraph",
        text: "Design a lock screen editor that feels powerful but approachable — where every user can create something beautiful in under 2 minutes, without needing design expertise.",
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-3.png",
            alt: "Problems identified in early concepts",
            caption: "Risk analysis: feature overwhelm and incoherence",
          },
          {
            src: "/lockscreen/1-4.png",
            alt: "Design goal statement",
            caption: "Design goal: powerful yet approachable",
          },
        ],
      },
    ],
  },
  {
    id: "research",
    title: "Step 1: Research",
    sectionNumber: 7,
    speakerNotes:
      "We did a deep competitive teardown of Apple's implementation, documenting every interaction, every edge case, and every decision they made. The findings were illuminating — Apple optimized for delight over power, which left room for Xiaomi to differentiate on depth.",
    content: [
      { type: "heading", text: "Step 1: Research" },
      { type: "subheading", text: "Competitive analysis · Apple iOS 16 deep dive" },
      {
        type: "paragraph",
        text: "We ran a structured competitive analysis focused on Apple iOS 16 as the market-defining benchmark, supplemented by Samsung, OPPO, and Vivo implementations.",
      },
      {
        type: "bullets",
        items: [
          "Apple strength: beautiful defaults, depth photo effect, seamless preview",
          "Apple limitation: limited widget library, no font color customization, no wallpaper-widget coordination",
          "Samsung One UI: powerful but cluttered, steep learning curve",
          "Key finding: users want templates as a starting point, not as a limitation",
          "Key finding: the 'apply' moment is the most anxiety-inducing part of the flow",
        ],
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-5.png",
            alt: "Competitive analysis matrix",
            caption: "Competitive analysis across iOS 16, Samsung, OPPO, and Vivo",
          },
          {
            src: "/lockscreen/1-6.png",
            alt: "Apple iOS 16 deep dive findings",
            caption: "Apple iOS 16 interaction teardown",
          },
        ],
      },
    ],
  },
  {
    id: "breakdown",
    title: "Step 2: Break Down the Template",
    sectionNumber: 8,
    speakerNotes:
      "The breakthrough insight was modeling the lock screen as two distinct layers: the wallpaper layer and the element layer. This two-layer model became the conceptual foundation for the entire editing experience and the information architecture.",
    content: [
      { type: "heading", text: "Step 2: Break Down the Template" },
      { type: "subheading", text: "Editable options matrix · Two-layer model" },
      {
        type: "paragraph",
        text: "We decomposed every possible editable element on the lock screen into a structured matrix, then identified the relationships between them. This led to our two-layer model.",
      },
      {
        type: "bullets",
        items: [
          "Layer 1 — Wallpaper: photo, live wallpaper, AI-generated, Xiaomi themes",
          "Layer 2 — Elements: clock, date, widgets (top/bottom), notification style",
          "Each element has: position, size, style, color, content source",
          "Cross-layer dependencies: element color should auto-adapt to wallpaper",
          "Template = a saved state of both layers simultaneously",
        ],
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-7.png",
            alt: "Editable elements matrix",
            caption: "Decomposing every editable element",
          },
          {
            src: "/lockscreen/1-8.png",
            alt: "Two-layer model diagram",
            caption: "The two-layer mental model: wallpaper + elements",
          },
        ],
      },
    ],
  },
  {
    id: "data-alignment",
    title: "Step 3: Data & Alignment",
    sectionNumber: 9,
    speakerNotes:
      "A critical alignment moment came when data from the PM team confirmed that wallpaper is the primary driver of lock screen customization behavior. 78% of users who customized their lock screen started with wallpaper. This data reshaped our prioritization.",
    content: [
      { type: "heading", text: "Step 3: Data & Alignment" },
      { type: "subheading", text: "PM alignment · Wallpaper as core" },
      {
        type: "paragraph",
        text: "Working with the PM, we pulled MIUI usage data to understand the current state of lock screen customization and where users were spending time.",
      },
      {
        type: "bullets",
        items: [
          "78% of lock screen customizations start with a wallpaper change",
          "Only 23% of users ever changed clock style after setting wallpaper",
          "Template adoption: users who start from a template complete the flow 3x more often",
          "Alignment decision: wallpaper selection is the entry point and anchor of the entire flow",
          "PM agreement: deprioritize advanced element customization in V1",
        ],
      },
      {
        type: "image",
        src: "/lockscreen/1-9.png",
        alt: "Data alignment presentation with PM",
        caption: "Data-driven prioritization: wallpaper as the north star",
      },
    ],
  },
  {
    id: "strategy",
    title: "Product Strategy & Design Goals",
    sectionNumber: 10,
    speakerNotes:
      "With research, data, and alignment complete, we crystallized three product goals and three corresponding design strategies. These became the filter for every design decision for the rest of the project.",
    content: [
      { type: "heading", text: "Product Strategy & Design Goals" },
      { type: "subheading", text: "3 goals · 3 strategies" },
      {
        type: "paragraph",
        text: "From our research and alignment phase, we established a clear strategic framework to guide design decisions.",
      },
      { type: "subheading", text: "Goals" },
      {
        type: "bullets",
        items: [
          "Goal 1: Enable anyone to create a beautiful lock screen in under 2 minutes",
          "Goal 2: Surface the full depth of customization options progressively",
          "Goal 3: Make every combination look intentionally designed, not random",
        ],
      },
      { type: "subheading", text: "Strategies" },
      {
        type: "bullets",
        items: [
          "Strategy 1: Templates-first entry with escape hatches to granular control",
          "Strategy 2: Wallpaper-driven theming — elements auto-adapt to wallpaper palette",
          "Strategy 3: Live preview at every step — no 'apply and hope'",
        ],
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-10.png",
            alt: "Product strategy overview",
            caption: "Strategic framework",
          },
          {
            src: "/lockscreen/1-11.png",
            alt: "Design goals diagram",
            caption: "3 goals · 3 strategies",
          },
        ],
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-12.png",
            alt: "Templates-first entry concept",
            caption: "Strategy 1: templates-first",
          },
          {
            src: "/lockscreen/1-13.png",
            alt: "Wallpaper-driven theming concept",
            caption: "Strategy 2: wallpaper-driven theming",
          },
        ],
      },
    ],
  },
  {
    id: "cross-nav",
    title: "Key Decision: Cross Navigation",
    sectionNumber: 11,
    speakerNotes:
      "The most debated design decision was how to handle navigation between the two editing axes — vertical for wallpaper selection, horizontal for element configuration. The two-axis UX pattern we developed, paired with a persistent Apply button, became the signature interaction of the editor.",
    content: [
      { type: "heading", text: "Key Decision: Cross Navigation" },
      { type: "subheading", text: "Two-axis UX pattern · Apply button design" },
      {
        type: "paragraph",
        text: "The core navigation challenge: users need to switch between wallpapers (a browsing task) and configure elements (an editing task). These are fundamentally different mental modes.",
      },
      {
        type: "bullets",
        items: [
          "Vertical scroll: browse and select wallpapers (gallery mental model)",
          "Horizontal swipe: switch between element configuration panels",
          "Lock screen preview: always visible, always shows current state",
          "Apply button: sticky, only activates when changes are unsaved",
          "Cancel: reverts all changes, with confirmation if edits are substantial",
        ],
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-14.png",
            alt: "Cross navigation diagram",
            caption: "Two-axis navigation model",
          },
          {
            src: "/lockscreen/1-15.png",
            alt: "Apply button states",
            caption: "Apply button state design",
          },
        ],
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-16.png",
            alt: "Navigation interaction detail",
            caption: "Vertical scroll: wallpaper gallery",
          },
          {
            src: "/lockscreen/1-17.png",
            alt: "Element panel switching",
            caption: "Horizontal swipe: element panels",
          },
        ],
      },
      {
        type: "image",
        src: "/lockscreen/1-18.png",
        alt: "Complete navigation flow",
        caption: "Full cross-navigation interaction model",
      },
    ],
  },
  {
    id: "usability",
    title: "Usability Testing & Iterations",
    sectionNumber: 12,
    speakerNotes:
      "We ran three rounds of usability testing with 8 participants each. The most surprising finding was that users didn't understand the horizontal swipe gesture for switching panels — we had to introduce motion cues and a title redesign to solve this.",
    content: [
      { type: "heading", text: "Usability Testing & Iterations" },
      { type: "subheading", text: "Test results · Title redesign · Motion cues" },
      {
        type: "paragraph",
        text: "Three rounds of moderated usability testing with 24 participants total (8 per round). Each round targeted specific hypotheses.",
      },
      { type: "subheading", text: "Key Findings & Iterations" },
      {
        type: "bullets",
        items: [
          "Finding: 6/8 users didn't discover horizontal panel switching in Round 1",
          "Iteration: Added animated carousel indicator dots below the preview",
          "Finding: 'Apply' button was missed when wallpaper selection was in focus",
          "Iteration: Apply button anchored to bottom of screen, always visible",
          "Finding: Users confused 'style' (visual preset) with 'widget' (live data)",
          "Iteration: Renamed 'Style' to 'Theme' and 'Widget' to 'Info' in UI labels",
          "Round 3 result: 7/8 users completed full customization task in under 2 minutes",
        ],
      },
      {
        type: "image",
        src: "/lockscreen/1-19.png",
        alt: "Before and after usability iteration",
        caption: "Before and after: panel navigation with motion cues",
      },
      {
        type: "video",
        provider: "screenpal",
        videoId: "cOeDFMnZ7xt",
        caption: "Usability test session recording",
      },
    ],
  },
  {
    id: "final-shots",
    title: "Final Design Shots",
    sectionNumber: 13,
    speakerNotes:
      "These final design shots represent the polished, shipped product. Each screen was refined through dozens of iterations and stakeholder reviews. The visual design reflects MIUI's evolution toward a cleaner, more premium aesthetic.",
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
            alt: "Lock screen editor entry screen",
            caption: "Entry: long-press on lock screen to enter editor",
          },
          {
            src: "/lockscreen/1-21.png",
            alt: "Wallpaper selection screen",
            caption: "Wallpaper gallery with live preview",
          },
        ],
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-22.png",
            alt: "Element customization panel",
            caption: "Element editor with auto-color adaptation",
          },
          {
            src: "/lockscreen/1-23.png",
            alt: "Final lock screen with applied customization",
            caption: "Final applied lock screen — custom photo, adapted clock color",
          },
        ],
      },
    ],
  },
  {
    id: "closing",
    title: "Closing",
    sectionNumber: 14,
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
