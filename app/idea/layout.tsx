export default function IdeaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
