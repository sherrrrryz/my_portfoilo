import Link from "next/link";
import { FadeInWhenVisible } from "../../components/fadeIn";
import React from "react";
import Project3Col from "app/components/project3col";
import { SectionDivider } from "app/about/page";
import PageHeader from "app/components/pageheader";
import { TwoCol } from "app/components/twocol";
import ResponsiveImg from "app/components/projectimg";

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
  team: ["Design lead 1", "UX Designer (Me)", "Graphic Designer 4", "Product Manager 2"],
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
    hero: ["/lockscreen/lockscreencover.png", "/lockscreen/background.png"],
    competitor: ["/lockscreen/competitor1.png", "/lockscreen/competitor2.png"],
    strategy: ["/lockscreen/strategy1.png", "/lockscreen/strategy2.png", "/lockscreen/strategy3.png", "/lockscreen/strategy4.png"],
    final: ["/lockscreen/final1.png", "/lockscreen/final2.png", "/lockscreen/final3.png", "/lockscreen/final4.png", "/lockscreen/final5.png"],
  },
};


export default function ProjectLockScreen() {
  return (
    
    <main className="w-full py-4 md:py-8">
      <Link 
          href="/projects" 
          className="inline-flex items-center text-[var(--nav-fg)] hover:text-[var(--accent)] mb-8 transition-colors"
        >
          ← See All Projects
        </Link>
      
      <ResponsiveImg 
        src={project.images.hero[0]} 
        alt={project.title} 
      />

      <PageHeader
        subtitle={project.subtitle}
        title={project.title}
      />

      <SectionDivider />

      {/* Overview */}
      <Project3Col
      overview={project.overview}
      contributions={project.contributions}
      team={project.team}
      />

      <SectionDivider />

      <TwoCol title="Project Background" children={project.background} />

      <ResponsiveImg 
        src={project.images.hero[1]} 
        alt={project.title} 
      />

      <SectionDivider />

      <TwoCol title="Competitor Analysis">
        <div className="space-y-4 leading-relaxed">
          {project.competitorFindings.map((text, i) => (
          <li key={i}>{text}</li>
          ))}
        </div>
      </TwoCol>

      <ResponsiveImg 
        src={project.images.competitor[0]} 
        alt={project.title} 
      />
      <ResponsiveImg 
        src={project.images.competitor[1]} 
        alt={project.title} 
      />

      <SectionDivider />

      <TwoCol title="Design Principles / Goals">
        <div className="space-y-4 leading-relaxed">
          {project.designPrinciples.map((text, i) => (
          <li key={i}>{text}</li>
          ))}
        </div>
      </TwoCol>

      <div className="w-full my-4 md:my-8 text-lg md:text-2xl font-bold text-[var(--nav-fg)]">
      Product Strategies
      </div>

      <div className="w-full my-3 md:my-6 text-sm md:text-base text-[var(--nav-fg)]">
      {project.strategies[0]}
      </div>

      <ResponsiveImg 
        src={project.images.strategy[0]} 
        alt={project.title} 
      />
      <ResponsiveImg 
        src={project.images.strategy[1]} 
        alt={project.title} 
      />

      <div className="w-full my-3 md:my-6 text-sm md:text-base text-[var(--nav-fg)]">
      {project.strategies[1]}
      </div>

      <ResponsiveImg 
        src={project.images.strategy[2]} 
        alt={project.title} 
      />

      <div className="w-full my-3 md:my-6 text-sm md:text-base text-[var(--nav-fg)]">
      {project.strategies[2]}
      </div>

      <ResponsiveImg 
        src={project.images.strategy[3]} 
        alt={project.title} 
      />

      <SectionDivider />

      <TwoCol title="Final Model Highlights">
        <div className="space-y-4 leading-relaxed">
          {project.finalModelHighlights.map((text, i) => (
          <li key={i}>{text}</li>
          ))}
        </div>
      </TwoCol>

      <ResponsiveImg 
        src={project.images.final[0]} 
        alt={project.title} 
      />
      <ResponsiveImg 
        src={project.images.final[1]} 
        alt={project.title} 
      />
      <ResponsiveImg 
        src={project.images.final[2]} 
        alt={project.title} 
      />

      <ResponsiveImg 
        src={project.images.final[3]} 
        alt={project.title} 
      />

      <ResponsiveImg 
        src={project.images.final[4]} 
        alt={project.title} 
      />
      
      <SectionDivider />

      <TwoCol title="Usability Results">
        <div className="space-y-4 leading-relaxed">
          {project.usabilityFocus.map((text, i) => (
          <li key={i}>{text}</li>
          ))}
        </div>
      </TwoCol>
 
    </main>
  );
}
