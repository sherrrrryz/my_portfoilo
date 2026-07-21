"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CORRECT_PASSWORD = "102594";

const CONTACT_EMAIL = "sherrrryz@outlook.com";

/* Click-to-copy, matching the footers. Not a mailto: that only does anything
   when the device has a mail client registered, and fails silently when it
   doesn't. Falls back to selecting the address if the Clipboard API is denied,
   so there is never a dead end. Per-page copy (isolation rule). */
function CopyMail() {
  const [toast, setToast] = useState("");
  const mailRef = useRef<HTMLButtonElement | null>(null);

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
      const el = mailRef.current;
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setToast("Selected. Press \u2318C or Ctrl+C");
    }
  };

  return (
    <>
      <button
        ref={mailRef}
        type="button"
        className="lsx-btn lsx-btn--ghost lsx-modal__mail"
        aria-label={`Copy email address: ${CONTACT_EMAIL}`}
        onClick={copy}
      >
        {CONTACT_EMAIL}
      </button>
      <div
        className={`lsx-toast${toast ? " lsx-toast--on" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </>
  );
}

export default function SeeDetailModal({ isOpen, onClose }: SeeDetailModalProps) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
    setDigits(Array(6).fill(""));
    setError(false);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const combined = newDigits.join("");
    if (combined.length === 6) {
      if (combined === CORRECT_PASSWORD) {
        router.push("/projects/lockscreen/detail");
      } else {
        setError(true);
        setDigits(Array(6).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    setError(false);

    if (pasted.length === 6) {
      if (pasted === CORRECT_PASSWORD) {
        router.push("/projects/lockscreen/detail");
      } else {
        setError(true);
        setDigits(Array(6).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    } else {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lsx-modal-ov" onClick={onClose}>
      <div
        className="lsx-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button onClick={onClose} className="lsx-modal__close" aria-label="Close">
          ✕
        </button>

        {/* Section 1: Password */}
        <div>
          <h2 className="lsx-modal__h">Enter password to view details</h2>
          <p className="lsx-modal__p">6-digit password required</p>
          <div className={`lsx-otp${error ? " lsx-otp--error" : ""}`} onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>
          {error && (
            <p className="lsx-modal__err">Incorrect password. Please try again.</p>
          )}
        </div>

        <hr className="lsx-modal__hr" />

        {/* Section 2: Contact. Click-to-copy, not a form — the site sends no
            mail of its own, so the address goes to the visitor's clipboard and
            they write from wherever they actually read mail. */}
        <div>
          <h2 className="lsx-modal__h">Contact me to learn more</h2>
          <p className="lsx-modal__p">
            Send me an email and I&apos;ll share the details with you.
          </p>
          <CopyMail />
        </div>
      </div>
    </div>
  );
}
