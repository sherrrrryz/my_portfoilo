import Link from "next/link";

export default function MultiLanguage() {
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

        <h1 className="text-4xl font-bold text-[var(--sh-identifier)] mb-8">Multi-language Support</h1>
        
        <div className="text-[var(--nav-fg)] space-y-4 text-lg leading-relaxed">
          <p>Designed a seamless multilingual experience supporting 15+ languages with RTL (Right-to-Left) text support.</p>
          <p>I tackled complex localization challenges including dynamic layout adjustments, cultural color preferences, and region-specific user behavior patterns.</p>
          <p>The solution increased global user engagement by 35% and successfully launched in markets across Asia, Europe, and the Middle East.</p>
        </div>
      </div>
    </section>
  );
}