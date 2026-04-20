'use client';

/* ============================================================
   S5 Block 1 — Bio sticky-note + pinned polaroid portrait.
   Left: yellow ruled pad with a short intro.
   Right: one polaroid that reads as a "me today" headshot.
   Row collapses to column under 900px.
   ============================================================ */

import Polaroid from './Polaroid';

export default function BioRow() {
  return (
    <div className="cu-bio-row">
      <article className="cu-sticky" aria-label="About Sherry">
        <span className="cu-sticky__tape" aria-hidden="true" />

        <h3 className="cu-sticky__title">
          Hi, I&rsquo;m Sherry
          <span className="cu-sparkle" aria-hidden="true">✦</span>
        </h3>

        <div className="cu-sticky__body">
          <p>
            I&rsquo;m a <strong>UX Designer</strong> who likes to mess with
            systems, at work and off the clock.
          </p>
          <p>
            By day I&rsquo;ve shipped features to <strong>700M phones</strong>,
            run <strong>40-person workshops</strong>, and rebuilt the onboarding
            flow that quietly prints revenue for a few OEMs.
          </p>
          <p>
            Off the clock I build little iOS toys, teach my{' '}
            <strong>two cats</strong> new tricks, and chase one more run down
            the slope.
          </p>
          <p>
            Currently open to <strong>new adventures</strong>. If you&rsquo;re
            building for real people, let&rsquo;s talk.
          </p>
        </div>
      </article>

      <div className="cu-portrait">
        <Polaroid
          src="/photos/photo4.jpg"
          alt="Sherry today"
          caption="still that same curiosity"
          aspectRatio="3 / 4"
          rotate={2.4}
        />
      </div>
    </div>
  );
}
