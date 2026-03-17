"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CORRECT_PASSWORD = "102594";

export default function SeeDetailModal({ isOpen, onClose }: SeeDetailModalProps) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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

  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState("");

  const handleSendEmail = async () => {
    if (!name.trim() || !email.trim()) {
      setSendError("Please fill in your name and email.");
      return;
    }

    setSending(true);
    setSendError("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to send");
      }

      setSendSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setSendError("Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Reset contact form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSendSuccess(false);
      setSendError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] max-w-md bg-[var(--imgbg)] rounded-2xl p-8 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--nav-dim)] hover:text-[var(--nav-fg)] transition-colors text-xl cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Section 1: Password */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[var(--nav-fg)] mb-1">
            Enter password to view details
          </h2>
          <p className="text-sm text-[var(--nav-dim)] mb-4">
            6-digit password required
          </p>
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
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
                className={`w-11 h-13 text-center text-xl font-mono rounded-lg border-2 bg-transparent text-[var(--nav-fg)] outline-none transition-colors duration-200 ${
                  error
                    ? "border-red-500"
                    : "border-[var(--nav-border)] focus:border-[var(--accent)]"
                }`}
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">
              Incorrect password. Please try again.
            </p>
          )}
        </div>

        {/* Divider */}
        <hr className="border-t border-[var(--nav-border)] mb-8" />

        {/* Section 2: Contact */}
        <div>
          <h2 className="text-lg font-bold text-[var(--nav-fg)] mb-1">
            Contact me to learn more
          </h2>
          <p className="text-sm text-[var(--nav-dim)] mb-4">
            Send me an email and I&apos;ll share the details with you.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--nav-border)] bg-transparent text-[var(--nav-fg)] placeholder:text-[var(--nav-dim)] outline-none focus:border-[var(--accent)] transition-colors text-sm"
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--nav-border)] bg-transparent text-[var(--nav-fg)] placeholder:text-[var(--nav-dim)] outline-none focus:border-[var(--accent)] transition-colors text-sm"
            />
            <textarea
              placeholder="Message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--nav-border)] bg-transparent text-[var(--nav-fg)] placeholder:text-[var(--nav-dim)] outline-none focus:border-[var(--accent)] transition-colors text-sm resize-none"
            />
          </div>

          {sendSuccess ? (
            <p className="mt-4 text-center text-sm text-[var(--accent)] font-semibold py-3">
              ✓ Email sent successfully! I&apos;ll get back to you soon.
            </p>
          ) : (
            <>
              {sendError && (
                <p className="mt-3 text-red-500 text-sm text-center">{sendError}</p>
              )}
              <button
                onClick={handleSendEmail}
                disabled={sending}
                className="mt-4 inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-lg border-2 border-[var(--accent)] text-[var(--accent)] font-semibold text-sm tracking-wider transition-all duration-200 hover:bg-[var(--accent)] hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : "Send Email"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
