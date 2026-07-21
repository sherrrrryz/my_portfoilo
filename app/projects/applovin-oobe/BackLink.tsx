"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* Nav "back" link for the AppLovin OOBE case study. Returns the visitor
   wherever they came from instead of always dumping them on the homepage:
   history.back() when the previous entry is provably ours, the referrer path
   when they arrived by a hard navigation, /projects otherwise (direct hit,
   new tab, reload). Duplicated per page, same as ThemeToggle (isolation
   rule: themed pages share tokens.css only, never TSX). */
export default function BackLink({ label }: { label: string }) {
  const router = useRouter();
  const [href, setHref] = useState("/projects");
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    /* A soft <Link> navigation leaves the document's load URL behind, so a
       mismatch here means we got here from another page of ours. */
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const soft = Boolean(nav && nav.name !== window.location.href);

    let sameOrigin = false;
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.origin === window.location.origin && ref.pathname !== window.location.pathname) {
        sameOrigin = true;
        setHref(ref.pathname + ref.search);
      }
    } catch {
      /* malformed referrer — keep the /projects fallback */
    }

    setCanGoBack(soft || sameOrigin);
  }, []);

  return (
    <Link
      href={href}
      className="alo-nav__link"
      onClick={(e) => {
        /* Modified clicks still open the resolved href in a new tab. */
        if (!canGoBack || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        router.back();
      }}
    >
      {label}
    </Link>
  );
}
