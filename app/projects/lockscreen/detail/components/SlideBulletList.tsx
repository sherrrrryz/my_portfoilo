export function SlideBulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mb-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[var(--nav-fg)] leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--nav-dim)] flex-shrink-0 mt-[0.6em]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
