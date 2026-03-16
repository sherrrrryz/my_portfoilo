import Link from "next/link";
import { FadeInWhenVisible } from "../../components/fadeIn";
import React from "react";
import Project3Col from "app/components/project3col";
import { SectionDivider } from "app/components/sectionDivider";
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
  title: "Study of Touch Hotspots on Larger Mobile Screens",
  subtitle: "Project Lead · Experimental Design · Interaction Design",
  overview:
    "Through experiments, we derived the touch-hotspot map for today’s large-screen smartphones. This informs UI decisions such as button placement and size so people can operate phone features more accurately, quickly, and efficiently—improving operability and usability. As the design team’s first HCI research project, it produced results quickly and influenced practical design across business lines, laying the groundwork for future research projects.",
  contributions: [
    "User research",
    "Experiment design",
    "Data analysis",
    "User experience design",
  ],
  team: ["1 Team lead", "UX Designer (Me)", "1 Designe Engineer", "1 User Researcher"],
  background: [
    "Steve Jobs once said a 3.5-inch screen is the perfect size for consumers and that larger screens are foolish.",
    "However, Jobs lived only through the 3.5-inch era; since 2012, smartphone screens have continued to grow.",
    "Xiaomi’s best-selling models in recent years are around 6.8 inches.",
    "In this large-screen era, what does the touch-hotspot map look like, and what guidance should UI follow to enhance one-handed control?",
  ],
  goals: [
    "Obtain up-to-date hotspot data for large screens.",
    "Analyze more deeply and apply flexibly; provide new perspectives for product and design.",
    "Deliverables: (1) practical hotspot maps; (2) design guidelines for business designers; (3) reusable experiment and analysis methods for foldables/tablets.",
  ],
  research: [
    "Apple found that at 3.5\", a single thumb can reach ≥90% of the screen.",
    "Steven Hoober: users operate with one or two hands and various grips.",
    "Observation: 75% use a single thumb for touches; <50% hold the phone with one hand only.",
    "For one-thumb scenarios, two common grips: (1) pinky supports behind the phone; (2) pinky supports from below; proportions vary by gender, hand size, posture, etc.",
  ],

  // Scope
  scope: [
    "Device: Xiaomi 11, 6.8\"",
    "One-handed grip, two grip styles",
    "Thumb tapping",
    "Seated/standing, static posture",
  ],

  // Experiment Design
  experiment: [
    "Based on Apple’s 9×9 mm physical hotspot, divide the screen into 8×18 = 144 cells.",
    "Flow: (1) long-press blue start cell → (2) moving red cell appears → (3) after 1.5 s it turns green → (4) tap the green cell.",
    "Maintain grip; may skip if unreachable; long-press start cell before each trial to avoid prediction/carryover.",
    "Per-cell metrics: (1) hit rate; (2) skip rate; (3) error rate; (4) tap latency; (5) offset direction; (6) offset distance.",
    "Additional rules: collect demographics/hand metrics/typical hand; test both hands; choose a comfortable start cell.",
    "Practice mode with 10 tries.",
    "Participants: 20 per grip style; 20 male + 20 female per international adult hand-size categories.",
  ],

  // Data Visualization
  data: [
    "After pilot and formal runs, we visualized the data (left = left hand, right = right hand).",
    "The screen areas cluster into unreachable, reachable, and easy-reach zones.",
  ],

  // Summary & Application
  summary: [
    "Two optimization approaches: (1) Overlay hotspot map on static UI to adjust layout; (2) Combine with business data and task paths for deeper optimization.",
    "Examples: Among 500k DAU, ~70% finish after only editing the event title.",
    "Across the task, one-handed completion is impossible for both left- and right-hand grips.",
    "Even with two hands, the flow isn’t smooth; hands must reposition frequently.",
    "Proposed fixes: (1) Auto-focus the event-title input after tapping the bottom FAB; (2) Move “Cancel/Done” lower so they’re easy to reach post-input.",
    "Outcome: overall path length reduced by ~40%.",
  ],

  // Further Impact
  impact: [
    "A high-impact change—moving top tabs to bottom tabs—shipped in MIUI 15; results were shared with design/product/research teams and widely praised.",
    "This establishes a foundation for follow-ups on foldable touch hotspots, gesture-swipe hotspots, and eye-tracking hotspots.",
  ],

  // Insert your image links here (copied from xueyizhou.xyz project page)
  images: {
    hero: ["/toucharea/Cover.png", "/lockscreen/background.png"],
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


 
    </main>
  );
}
