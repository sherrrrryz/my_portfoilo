'use client';

interface DividerProps {
  active: boolean;
  dying: boolean;
}

export default function Divider({ active, dying }: DividerProps) {
  const cls = `divider-line ${active ? 'active' : ''} ${dying ? 'dying' : ''}`;
  return (
    <div style={{ flexShrink: 0, maxWidth: 1280, width: '100%', margin: '0 auto', paddingLeft: 'clamp(48px, 8vw, 120px)', paddingRight: 'clamp(48px, 8vw, 120px)', paddingTop: 16, paddingBottom: 16 }}>
      <div
        className={cls}
        style={{
          height: '1px',
          background: '#ffffff',
        }}
      />
    </div>
  );
}
