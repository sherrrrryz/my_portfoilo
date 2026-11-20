/* ============================================================================
   /ai — server half. The page itself is a client component (lang state,
   theme toggle), so this thin wrapper only exports route metadata, same
   split as /projects.
============================================================================ */

import type { Metadata } from "next";
import AiRelated from "./AiRelated";

export const metadata: Metadata = {
  title: "AI Related · Xueyi Zhou",
  description:
    "Seven personal projects by Xueyi (Sherry) Zhou, from a CHI paper library to a documentation kit for AI agents.",
};

export default function AiPage() {
  return <AiRelated />;
}
