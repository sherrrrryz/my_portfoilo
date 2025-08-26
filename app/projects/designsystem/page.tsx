import Link from "next/link";

export default function DesignSystem() {
  return (
    <section className="w-full">
      <div className="mx-auto px-6 md:px-16 py-12">
        {/* 返回按钮 */}
        <Link 
          href="/projects" 
          className="inline-flex items-center text-[var(--nav-fg)] hover:text-[var(--accent)] mb-8 transition-colors"
        >
          ← Back to Projects
        </Link>

        <h1 className="text-4xl font-bold text-[var(--sh-identifier)] mb-8">Design System</h1>
        
        <div className="text-[var(--nav-fg)] space-y-4 text-lg leading-relaxed">
          <p>A comprehensive design system built to ensure consistency across multiple product lines and platforms.</p>
          <p>I developed a scalable component library with detailed documentation, covering everything from typography and color palettes to complex interaction patterns.</p>
          <p>The system reduced design-to-development time by 40% and improved cross-team collaboration through standardized design tokens and guidelines.</p>
        </div>
      </div>
    </section>
  );
}