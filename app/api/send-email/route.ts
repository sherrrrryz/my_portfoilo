import { NextRequest, NextResponse } from "next/server";

/* ============================================================================
   POST /api/send-email — the contact form's only backend.

   Restored after e6a690f ("remove unused routes") deleted it and left the
   form POSTing into a 404. Service is Resend (REST, no SDK — one fetch is
   cheaper than a dependency).

   Everything deployment-specific comes from env so the addresses can change
   without a code edit:

     RESEND_API_KEY  required. Without it the route 500s and says so.
     CONTACT_TO      inbox that receives the mail. Default: the outlook one.
     CONTACT_FROM    sender. Default: Resend's shared onboarding@resend.dev,
                     which ONLY delivers to the Resend account owner's own
                     address. To reach any other CONTACT_TO you must verify a
                     domain on resend.com and set this to an address on it.

   `context` is a free-text label from the caller (e.g. "Lock Screen") that
   only shapes the subject line, so one route serves every page's form.
============================================================================ */

const FROM_FALLBACK = "Portfolio Contact <onboarding@resend.dev>";
const TO_FALLBACK = "sherrrryz@outlook.com";

/* Subject lines are a header: a newline in an attacker-controlled value is a
   header-injection primitive. Flatten whitespace and cap the length. */
function forHeader(s: string, max = 80) {
  return s.replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const context = typeof body.context === "string" ? body.context.trim() : "";

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }
    /* Deliberately loose — the real validation is Resend bouncing it back.
       This only catches the obvious paste-error case. */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "That email address doesn't look right" },
        { status: 400 }
      );
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("send-email: RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const label = context ? `${forHeader(context, 40)} — ` : "";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || FROM_FALLBACK,
        to: process.env.CONTACT_TO || TO_FALLBACK,
        subject: `${label}message from ${forHeader(name)}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${
          message || "(No message provided)"
        }`,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      /* Resend's body explains the real cause (unverified domain, bad key,
         recipient not allowed for the shared sender). Log it — never return
         it, it can carry account details. */
      const detail = await res.text();
      console.error(`send-email: Resend returned ${res.status}`, detail);
      return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send-email: unexpected error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
