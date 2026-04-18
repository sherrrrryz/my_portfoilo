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
      className="fl-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        overflowX: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
