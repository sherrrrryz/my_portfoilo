/* Route metadata lives here because page.tsx is a client component
   (it holds the EN/中文 language state). */
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Touch Hot Zone · Xueyi Zhou",
  description:
    "Mapping where thumbs actually reach on a 6.8-inch screen, so layout decisions stop being guesses.",
};

export default function TouchHotspotsLayout({ children }: { children: ReactNode }) {
  return children;
}
