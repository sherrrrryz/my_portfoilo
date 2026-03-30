'use client';

interface DividerProps {
  active: boolean;
  dying: boolean;
}

export default function Divider({ active, dying }: DividerProps) {
  const cls = `divider-line ${active ? 'active' : ''} ${dying ? 'dying' : ''}`;
  return (
    <div style={{ flexShrink: 0, paddingLeft: 'clamp(48px, 8vw, 120px)', paddingRight: 'clamp(48px, 8vw, 120px)' }}>
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
