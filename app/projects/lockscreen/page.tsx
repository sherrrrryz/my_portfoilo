import Link from "next/link";

export default function LockScreen() {
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

        <h1 className="text-4xl font-bold text-[var(--sh-identifier)] mb-8">Lock Screen Design</h1>
        
        <div className="text-[var(--nav-fg)] space-y-4 text-lg leading-relaxed">
          <p>This project focuses on reimagining the mobile lock screen experience with enhanced security and personalization features.</p>
          <p>I explored innovative interaction patterns that balance accessibility with privacy, creating intuitive gestures for quick access to frequently used functions.</p>
          <p>The design incorporates adaptive themes and customizable widgets, allowing users to transform their lock screen into a personalized dashboard.</p>
        </div>
      </div>
    </section>
  );
}

