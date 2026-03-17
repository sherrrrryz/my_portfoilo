import Link from "next/link";
import PageHeader from "app/components/pageheader";

export default function LockscreenDetail() {
  return (
    <main className="w-full py-4 md:py-8">
      <Link
        href="/projects/lockscreen"
        className="inline-flex items-center text-[var(--nav-fg)] hover:text-[var(--accent)] mb-8 transition-colors"
      >
        ← Back to Lock Screen Project
      </Link>

      <PageHeader
        subtitle="Lock Screen Personalization Editing"
        title="Project Details"
      />

      <div className="mt-12 text-[var(--nav-fg)] leading-relaxed">
        <p>Detailed project content will be added here.</p>
      </div>
    </main>
  );
}
