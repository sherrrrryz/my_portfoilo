import '../globals.css';
import './styles/flashlight.css';

export const metadata = {
  title: 'Flashlight',
};

export default function FlashlightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {children}
    </div>
  );
}
