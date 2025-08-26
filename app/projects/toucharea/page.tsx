import Link from "next/link";

export default function TouchArea() {
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

        <h1 className="text-4xl font-bold text-[var(--sh-identifier)] mb-8">Touch Area Optimization</h1>
        
        <div className="text-[var(--nav-fg)] space-y-4 text-lg leading-relaxed">
          <p>An in-depth study of mobile touch interactions focusing on accessibility and ergonomic design principles.</p>
          <p>I conducted user testing with 200+ participants to optimize button sizes, spacing, and placement for one-handed usage across different screen sizes.</p>
          <p>The research findings led to a 25% reduction in user errors and significantly improved usability for users with motor disabilities.</p>
        </div>
      </div>
    </section>
  );
}