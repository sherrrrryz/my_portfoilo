'use client';

/* The one interactive bit of /resume: opens the browser print dialog, where
   "Save as PDF" produces a text-based (selectable, parseable) A4 file. Kept
   in its own client file so the page itself stays a server component. */
export default function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className="rs-btn" onClick={() => window.print()}>
      {label}
    </button>
  );
}
