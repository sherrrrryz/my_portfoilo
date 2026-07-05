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

        {/* Section 2: Contact */}
        <div>
          <h2 className="lsx-modal__h">Contact me to learn more</h2>
          <p className="lsx-modal__p">
            Send me an email and I&apos;ll share the details with you.
          </p>

          <div className="lsx-field">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              placeholder="Message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {sendSuccess ? (
            <p className="lsx-modal__ok">
              ✓ Email sent successfully! I&apos;ll get back to you soon.
            </p>
          ) : (
            <>
              {sendError && <p className="lsx-modal__err">{sendError}</p>}
              <button
                onClick={handleSendEmail}
                disabled={sending}
                className="lsx-btn lsx-btn--ghost lsx-modal__send"
              >
                {sending ? "Sending..." : "Send email"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
