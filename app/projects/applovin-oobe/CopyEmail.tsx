"use client";

/* Click-to-copy for the CTA. Not a mailto: that only does something when the
   device has a mail client registered, and on one that doesn't it fails
   silently. Falls back to selecting the address if the Clipboard API is
   denied, so there is never a dead end. Its own file because the AppLovin
   OOBE page is a server component; same split as ThemeToggle. Duplicated per
   page (isolation rule: themed pages share tokens.css only, never TSX). */
import { useEffect, useRef, useState } from "react";

const CONTACT_EMAIL = "sherrrryz@outlook.com";

export default function CopyEmail({ label }: { label: string }) {
  const [toast, setToast] = useState("");
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setToast("Copied to clipboard");
    } catch {
      const el = btnRef.current;
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setToast("Selected. Press ⌘C or Ctrl+C");
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="alo-btn"
        aria-label={`Copy email address: ${CONTACT_EMAIL}`}
        onClick={copy}
      >
        {label}
      </button>
      <div
        className={`alo-toast${toast ? " alo-toast--on" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </>
  );
}
