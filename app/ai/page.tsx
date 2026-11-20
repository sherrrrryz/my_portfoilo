/* ============================================================================
   /ai — server half. The page itself is a client component (lang state,
   theme toggle), so this thin wrapper only exports route metadata, same
   split as /projects. noindex and absent from the sitemap until the real
   content lands.
============================================================================ */

import type { Metadata } from "next";
import AiRelated from "./AiRelated";

export const metadata: Metadata = {
  title: "AI Related · Xueyi Zhou",
  description: "AI-related work by Xueyi (Sherry) Zhou.",
  robots: { index: false, follow: true },
};

export default function AiPage() {
  return <AiRelated />;
}
