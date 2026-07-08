/* ============================================================================
   /projects — server half. The index itself is a client component
   (bilingual lang state, theme toggle), so this thin wrapper exists only
   to export route metadata. Deliberately NOT a layout.tsx: a layout here
   would wrap every /projects/* case study and the legacy detail deck.
============================================================================ */

import type { Metadata } from "next";
import ProjectsIndex from "./ProjectsIndex";

export const metadata: Metadata = {
  title: "Projects · Xueyi Zhou",
  description:
    "Six projects by Xueyi (Sherry) Zhou: lock screens and design systems at Xiaomi, growth experiments at AppLovin, and one personal iOS project.",
};

export default function ProjectsPage() {
  return <ProjectsIndex />;
}
