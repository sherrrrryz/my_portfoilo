/* ============================================================================
   /projects/miui-design-system — thin server wrapper for metadata, same
   split as /projects (page.tsx + client component). The page content and
   the bilingual lang recipe live in ./MiuiDs.tsx.
============================================================================ */

import type { Metadata } from "next";
import MiuiDs from "./MiuiDs";

export const metadata: Metadata = {
  title: "MIUI Design System 2.0 · Xueyi Zhou",
  description:
    "Turning a design guideline nobody trusted into a system ten thousand employees could build on.",
};

export default function ProjectMiuiDesignSystem() {
  return <MiuiDs />;
}
