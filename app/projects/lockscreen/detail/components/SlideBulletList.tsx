export function SlideBulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 my-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[var(--nav-fg)] leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--nav-dim)] flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
