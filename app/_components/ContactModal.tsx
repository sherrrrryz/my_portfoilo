'use client';

/* ============================================================================
   The site's one contact form.

   Shared by /, /about, /projects and the lockscreen password gate. This is a
   deliberate exception to the per-page-copy convention that ThemeToggle /
   LangToggle / emojiCursor follow: those are stateless presentational bits
   where a copy costs nothing, while this carries fetch + loading + error +
   success state and a backend contract. Four copies of that drift.

   It also crosses the / ↔ /projects/lockscreen TSX isolation line. That rule
   exists to keep the legacy detail deck from entangling with new code; this
   is new code on both sides and imports nothing legacy, so the rule's purpose
   is intact. See CLAUDE.md, which records the exception.

   Styling reads --theme-* directly rather than any page's --sm-/--ab-/--pj-/
   --lsx- aliases, so it is correct on every page and in both themes without
   knowing which page mounted it.

   Two exports:
     ContactForm   the fields alone, for embedding (lockscreen's gate)
     ContactModal  the dialog shell around ContactForm, for the mail links
============================================================================ */

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

import './contact-modal.css';

export type ContactLang = 'en' | 'zh';

export const CONTACT_EMAIL = 'sherrrryz@outlook.com';

const COPY = {
  en: {
    title: 'Send me a message',
    sub: "I'll reply to the address you leave here.",
    name: 'Your name',
    email: 'Your email',
    message: 'Message (optional)',
    send: 'Send email',
    sending: 'Sending...',
    ok: "Sent. I'll get back to you soon.",
    errRequired: 'Please fill in your name and email.',
    errEmail: "That email address doesn't look right.",
    errSend: "Couldn't send that. Try again, or write to me directly.",
    direct: `Or write to ${CONTACT_EMAIL}`,
    close: 'Close',
  },
  zh: {
    title: '给我留言',
    sub: '我会回复到你留下的邮箱。',
    name: '你的名字',
    email: '你的邮箱',
    message: '留言（选填）',
    send: '发送',
    sending: '发送中...',
    ok: '已发送，我会尽快回复你。',
    errRequired: '请填写名字和邮箱。',
    errEmail: '这个邮箱地址看起来不太对。',
    errSend: '没能发送成功。请重试，或直接写信给我。',
    direct: `或直接写信到 ${CONTACT_EMAIL}`,
    close: '关闭',
  },
} as const;

/* Same shape the route validates with. Checked here too so an obvious typo
   costs a render instead of a round trip. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({
  lang,
  context,
  autoFocus = false,
}: {
  lang: ContactLang;
  /* free-text label that shapes the subject line, e.g. "Lock Screen" */
  context?: string;
  autoFocus?: boolean;
}) {
  const c = COPY[lang];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autoFocus) firstRef.current?.focus();
  }, [autoFocus]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError(c.errRequired);
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError(c.errEmail);
      return;
    }

    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          context,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setError(c.errSend);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <p className="cm-ok" role="status">
        {c.ok}
      </p>
    );
  }

  return (
    <form className="cm-form" onSubmit={submit} noValidate>
      <input
        ref={firstRef}
        type="text"
        name="name"
        autoComplete="name"
        placeholder={c.name}
        aria-label={c.name}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder={c.email}
        aria-label={c.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        name="message"
        rows={3}
        placeholder={c.message}
        aria-label={c.message}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* aria-live so the failure is announced, not just painted */}
      {error && (
        <p className="cm-err" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="cm-send" disabled={sending}>
        {sending ? c.sending : c.send}
      </button>

      {/* The escape hatch: if Resend is down or misconfigured, the visitor
          still has a way to reach the inbox. */}
      <a className="cm-direct" href={`mailto:${CONTACT_EMAIL}`}>
        {c.direct}
      </a>
    </form>
  );
}

export default function ContactModal({
  open,
  onClose,
  lang,
  context,
}: {
  open: boolean;
  onClose: () => void;
  lang: ContactLang;
  context?: string;
}) {
  const c = COPY[lang];
  /* createPortal needs a DOM; gate it so SSR and the first client render
     agree and React doesn't flag a hydration mismatch. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    /* Send focus back where it came from, so closing with Escape doesn't
       dump the keyboard user at the top of the document. */
    const opener = document.activeElement as HTMLElement | null;
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="cm-ov"
          role="dialog"
          aria-modal="true"
          aria-label={c.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="cm-panel"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="cm-close" onClick={onClose} aria-label={c.close}>
              ✕
            </button>
            <h2 className="cm-title">{c.title}</h2>
            <p className="cm-sub">{c.sub}</p>
            <ContactForm lang={lang} context={context} autoFocus />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
