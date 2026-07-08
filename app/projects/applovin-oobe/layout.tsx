/* Route metadata lives here because page.tsx is a client component
   (it holds the EN/中文 language state). */
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AppLovin OOBE App Discovery · Xueyi Zhou",
  description:
    "Four experiments to make app recommendations on a brand-new Android phone worth the tap.",
};

export default function ApplovinOobeLayout({ children }: { children: ReactNode }) {
  return children;
}
