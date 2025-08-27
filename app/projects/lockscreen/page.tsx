import Link from "next/link";
import { FadeInWhenVisible } from "../../components/fadeIn";
import React from "react";

// export default function LockScreen() {
//   return (
//     <section className="w-full">
//       <FadeInWhenVisible>
//       <div className="mx-auto px-6 md:px-16 py-12">
//         {/* 返回按钮 */}
//         <Link 
//           href="/projects" 
//           className="inline-flex items-center text-[var(--nav-fg)] hover:text-[var(--accent)] mb-8 transition-colors"
//         >
//           ← Back to Projects
//         </Link>

//         <h1 className="text-4xl font-bold text-[var(--sh-identifier)] mb-8">Lock Screen Design</h1>
        
//         <div className="text-[var(--nav-fg)] space-y-4 text-lg leading-relaxed">
//           <p>This project focuses on reimagining the mobile lock screen experience with enhanced security and personalization features.</p>
//           <p>I explored innovative interaction patterns that balance accessibility with privacy, creating intuitive gestures for quick access to frequently used functions.</p>
//           <p>The design incorporates adaptive themes and customizable widgets, allowing users to transform their lock screen into a personalized dashboard.</p>
//         </div>
//       </div>
//       </FadeInWhenVisible>
//     </section>
//   );
// }

/** Data model (edit here to drive the page) */
const project = {
  title: "Lock Screen Personalization Editing",
  subtitle: "Interaction Design · Product Design · Visual Design",
  overview:
    "In 2023, MIUI 15 will launch three new lock screens under its new design philosophy. While enhancing customization capabilities, it also showcases leadership in glass effects, AOD lock screen linkage, and cutout technologies, improving user satisfaction with lock screen aesthetics.",
  contributions: [
    "Product architecture design",
    "Interaction flow design",
    "UI design",
    "Prototype design and production",
    "Usability testing",
  ],
  team: ["Design lead 1", "Graphic Designer 4", "Product Manager 2"],
  background:
    "The project was initiated by lock screen visual designers who provided 7 new lock screen designs and 2 new technical capability requirements. As the interaction designer, I joined after the initial pitch succeeded to design the editing flows and framework for lock screen personalization.",
  potentialIssues: [
    "A wide variety of packages with unique characteristics makes it difficult to ensure framework universality;",
    "Lack of mainstream styles may confuse users among many options;",
    "Large differences in personalization capabilities make it hard for users to set expectations;",
    "Too many customization functions could overload a single page, leading to increased page hierarchy.",
  ],
  competitorFindings: [
    "New templates have low exposure, requiring users to click the bottom-right add button to view;",
    "Template images are small and details are difficult to preview;",
    "For users without customization needs, the application process is long (at least 6 steps);",
    "Templates are not interoperable, with inconsistent bottom editing options, making expectations unclear.",
  ],
  designPrinciples: [
    "When entering lock screen editing, new designs should be strongly showcased;",
    "Provide multiple preset combinations for low-customization users to apply quickly;",
    "Customization interaction framework must be highly generalizable and easy to use.",
  ],
  strategies: [
    "Strategy 1: Use “Classic Lock Screen / Diamond Time” as the flagship option, with multiple preset lock screen combinations;",
    "Strategy 2: Expand “Image Magazine” as a new style annually, depending on development resources and version updates;",
    "Strategy 3: Ensure all sets support at least the basic customization ability (information layer and wallpaper layer).",
  ],
  finalModelHighlights: [
    "Immersion: As large a template preview panel as possible, with vertical switching for templates and horizontal switching for preset variations;",
    "Instant Use: Users can apply anytime via the top-right button, reducing costs for low-customization users.",
  ],
  usabilityFocus: [
    "Long-press to trigger editing may cause accidental activations;",
    "Clicking on the panel does nothing, but user expectations vary (apply/customize/preview);",
    "Information layer style editing is in a secondary level, making it too deep;",
    "After customization, users cannot preview the effect before applying.",
  ],
  // Insert your image links here (copied from xueyizhou.xyz project page)
  images: {
    hero: ["/projectimg1.png"],
    tech: ["/tech.png"],
    flows: ["/flows.png"],
  },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--nav-fg)]">
      {children}
    </h2>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-[var(--nav-dim)] leading-relaxed">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-[var(--nav-accent)]">•</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function ImgRow({ srcs }: { srcs: string[] }) {
  if (!srcs?.length) return null;
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {srcs.map((src, i) => (
        <div
          key={i}
          className="w-full aspect-[2/1] bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden"
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

export default function ProjectLockScreen() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 md:px-10 lg:px-12 py-10 md:py-14">
      {/* Header */}
      <header className="mb-10 md:mb-14">
        <p className="uppercase text-sm tracking-wider text-[var(--nav-dim)]">
          {project.subtitle}
        </p>
        <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-[var(--nav-fg)]">
          {project.title}
        </h1>
        <ImgRow srcs={project.images.hero} />
      </header>

      {/* Overview */}
      <section className="mb-12 md:mb-16">
        <SectionTitle>Overview</SectionTitle>
        <p className="mt-3 text-[var(--nav-fg)] leading-relaxed">
          {project.overview}
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[var(--nav-fg)]">
              My Contributions
            </h3>
            <Bullets items={project.contributions} />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--nav-fg)]">Team</h3>
            <Bullets items={project.team} />
          </div>
        </div>
      </section>

      {/* Project Background */}
      <section className="mb-12 md:mb-16">
        <SectionTitle>Project Background</SectionTitle>
        <p className="mt-3 text-[var(--nav-fg)] leading-relaxed">
          {project.background}
        </p>
      </section>

      {/* Potential Issues */}
      <section className="mb-12 md:mb-16">
        <SectionTitle>Potential Issues</SectionTitle>
        <Bullets items={project.potentialIssues} />
      </section>

      {/* Competitor Analysis */}
      <section className="mb-12 md:mb-16">
        <SectionTitle>Competitor Analysis (Apple)</SectionTitle>
        <Bullets items={project.competitorFindings} />
      </section>

      {/* Design Principles / Goals */}
      <section className="mb-12 md:mb-16">
        <SectionTitle>Design Principles / Goals</SectionTitle>
        <Bullets items={project.designPrinciples} />
      </section>

      {/* Product Strategies */}
      <section className="mb-12 md:mb-16">
        <SectionTitle>Product Strategies</SectionTitle>
        <Bullets items={project.strategies} />
        <ImgRow srcs={project.images.tech} />
      </section>

      {/* Interaction Framework */}
      <section className="mb-12 md:mb-16">
        <SectionTitle>Interaction Framework</SectionTitle>
        <p className="mt-3 text-[var(--nav-fg)]">
          The main flows include: entry and trigger flow, lock screen applying
          flow, and customization flow for each template.
        </p>
        <ImgRow srcs={project.images.flows} />
      </section>

      {/* Highlights & Usability Focus */}
      <section className="mb-12 md:mb-16">
        <SectionTitle>Highlights of Final Model</SectionTitle>
        <Bullets items={project.finalModelHighlights} />
      </section>

      <section className="mb-12 md:mb-16">
        <SectionTitle>Usability Testing & Focus Points</SectionTitle>
        <Bullets items={project.usabilityFocus} />
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t border-[var(--nav-border)] text-sm text-[var(--nav-dim)]">
        © Sherry’s Portfolio
      </footer>
    </main>
  );
}
