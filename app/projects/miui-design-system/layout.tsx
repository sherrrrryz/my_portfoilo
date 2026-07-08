/* Route metadata lives here because page.tsx is a client component
   (it holds the EN/中文 language state). */
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MIUI Design System 2.0 · Xueyi Zhou",
  description:
    "Turning a design guideline nobody trusted into a system ten thousand employees could build on.",
};

export default function MiuiDesignSystemLayout({ children }: { children: ReactNode }) {
  return children;
}
