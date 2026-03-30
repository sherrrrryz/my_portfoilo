import { IBM_Plex_Mono } from 'next/font/google';
import '../globals.css';
import './styles/ephemeral.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '300',
});

export const metadata = {
  title: 'Ephemeral Chat',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={ibmPlexMono.className}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#080808',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {children}
    </div>
  );
}
