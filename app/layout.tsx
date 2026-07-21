import "./globals.css";
import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { metaData } from "./lib/config";

const inter = Inter({ subsets: ["latin"] });

// Switzer & IBM Plex Mono feed the new design system's --font-sans/--font-mono
// (tokens.css) via CSS variables only. Inter stays applied as before — the
// legacy detail deck's typography depends on it.
const switzer = localFont({
  src: [
    { path: "./fonts/Switzer-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/Switzer-VariableItalic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-switzer",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(metaData.baseUrl),
  title: {
    default: metaData.title,
    template: `%s | ${metaData.title}`,
  },
  description: metaData.description,
  openGraph: {
    images: metaData.ogImage,
    title: metaData.title,
    description: metaData.description,
    url: metaData.baseUrl,
    siteName: metaData.name,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: metaData.name,
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the inline theme script below sets data-theme
    // on <html> before hydration; React must not flag that attribute diff.
    <html
      lang="en"
      className={`${inter.className} ${switzer.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* Pre-paint theme resolution: saved choice, else OS preference.
            Sets data-theme on <html>; the page-theme tokens in
            _styles/tokens.css key off it. The legacy detail deck uses the
            `.dark` class instead, so this attribute never restyles it. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();",
          }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
