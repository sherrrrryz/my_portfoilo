'use client';

import '../../_styles/tokens.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../../_lab/ui/button';
import { Badge } from '../../_lab/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../_lab/ui/card';
import { Separator } from '../../_lab/ui/separator';
import { Input, Label } from '../../_lab/ui/input';

/* ------------------------------------------------------------------ */
/*  Token registries — names + roles, used to drive the spec sections */
/* ------------------------------------------------------------------ */

const NEUTRAL_RAMP = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const GREEN_RAMP = [50, 300, 500, 700, 900];
const TERRACOTTA_RAMP = [100, 500, 700];

const SEMANTIC_COLORS: Array<{ token: string; role: string }> = [
  { token: '--stage-light', role: 'Paper background (Sections 1-6)' },
  { token: '--stage-dark', role: 'Opening stage (Section 0)' },
  { token: '--ink-primary', role: 'Headlines, body strong' },
  { token: '--ink-secondary', role: 'Body default' },
  { token: '--ink-muted', role: 'Labels, meta' },
  { token: '--ink-faint', role: 'Strikethrough, hints' },
  { token: '--accent-pale', role: 'Accent wash · subtle bg tint' },
  { token: '--accent-muted', role: 'Accent fill · backgrounds' },
  { token: '--accent', role: 'Accent surface · CTA bg, link hover bg' },
  { token: '--accent-hover', role: 'Accent interactive · button hover, pressed' },
  { token: '--accent-ink', role: 'Accent text · editorial emphasis on paper' },
  { token: '--highlight-pale', role: 'Highlight wash · <mark> background behind text' },
  { token: '--highlight', role: 'Highlight surface · standalone statistic / number' },
  { token: '--highlight-ink', role: 'Highlight text · inside <mark> (paired w/ pale)' },
  { token: '--surface-0', role: 'Paper — page background' },
  { token: '--surface-1', role: 'Subtle lift — default card, input fill' },
  { token: '--surface-2', role: 'Higher contrast block — loser box, chip bg' },
  { token: '--surface-ink', role: 'Inverted — black slab, winner box' },
  { token: '--border-hairline', role: 'Hairline divider (rare; prefer surface shift)' },
  { token: '--border-strong', role: 'Focus ring, input boundary' },
  { token: '--border-ink', role: 'Emphatic outline (rarely needed)' },
];

const TEXT_SCALE: Array<{ token: string; label: string; weight?: number }> = [
  { token: '--text-micro', label: 'Corner label 11px' },
  { token: '--text-xs', label: 'Eyebrow 12px' },
  { token: '--text-sm', label: 'Footer link 13px' },
  { token: '--text-base', label: 'Body 16px' },
  { token: '--text-md', label: 'Body large' },
  { token: '--text-lg', label: 'Card actual' },
  { token: '--text-xl', label: 'Punch line' },
  { token: '--text-2xl', label: 'Pull quote', weight: 500 },
  { token: '--text-3xl', label: 'Section hero', weight: 800 },
  { token: '--text-display', label: 'Role line (Sec 0)', weight: 700 },
  { token: '--text-marquee', label: 'Marquee (Sec 0)', weight: 100 },
];

const SPACING_SCALE = [1, 2, 3, 4, 5, 6, 7, 8];
const RADIUS_SCALE: Array<{ token: string; label: string }> = [
  { token: '--radius-none', label: 'none' },
  { token: '--radius-sm', label: 'sm · 6px' },
  { token: '--radius-md', label: 'md · 12px' },
  { token: '--radius-lg', label: 'lg · 20px' },
  { token: '--radius-xl', label: 'xl · 32px' },
  { token: '--radius-2xl', label: '2xl · 48px' },
  { token: '--radius-pill', label: 'pill' },
];

const TOC: Array<{ id: string; label: string }> = [
  { id: 'controls', label: '01 · Live controls' },
  { id: 'colors', label: '02 · Colors' },
  { id: 'typography', label: '03 · Typography' },
  { id: 'spacing', label: '04 · Spacing' },
  { id: 'radius', label: '05 · Radius' },
  { id: 'story', label: '06 · Story components' },
  { id: 'shadcn', label: '07 · Shadcn primitives' },
  { id: 'stages', label: '08 · Stages' },
];

/* ------------------------------------------------------------------ */
/*  Hook: read resolved CSS variable from <html>                      */
/* ------------------------------------------------------------------ */
function useResolvedToken(name: string, tick: number) {
  const [value, setValue] = useState('');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    setValue(v);
  }, [name, tick]);
  return value;
}

/* Helper: set a CSS variable on :root (inline override wins). */
function setRootToken(name: string, value: string) {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(name, value);
}

/* Helper: clear inline overrides (return to tokens.css defaults). */
function clearRootToken(names: string[]) {
  if (typeof window === 'undefined') return;
  names.forEach((n) => document.documentElement.style.removeProperty(n));
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
export default function DesignSystemLab() {
  /* Tick bumps whenever user overrides a token. Forces token-readers
     (Swatch, TypeRow) to re-read computed values. */
  const [tick, setTick] = useState(0);
  const bump = useCallback(() => setTick((t) => t + 1), []);

  const editable = useMemo(
    () => [
      { token: '--accent', label: 'Accent (CTA, links)' },
      { token: '--accent-hover', label: 'Accent hover (deep)' },
      { token: '--accent-ink', label: 'Accent ink (emphasis text)' },
      { token: '--accent-pale', label: 'Accent pale (subtle bg)' },
      { token: '--highlight', label: 'Highlight (terracotta)' },
      { token: '--highlight-pale', label: 'Highlight pale (marker bg)' },
      { token: '--highlight-ink', label: 'Highlight ink (emphasis)' },
      { token: '--stage-light', label: 'Paper (light stage)' },
      { token: '--stage-dark', label: 'Opening (dark stage)' },
      { token: '--ink-primary', label: 'Ink primary' },
      { token: '--ink-muted', label: 'Ink muted' },
    ],
    []
  );

  return (
    <div style={styles.page}>
      {/* sticky TOC */}
      <aside style={styles.toc}>
        <div style={styles.tocTitle}>Design System</div>
        <ul style={styles.tocList}>
          {TOC.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} style={styles.tocLink}>
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* main column */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.eyebrow}>LAB · DS</div>
          <h1 style={styles.h1}>Design system playground</h1>
          <p style={styles.lede}>
            Bound to <code style={styles.code}>app/_styles/tokens.css</code>. Every
            swatch, specimen, and component below reads live values via{' '}
            <code style={styles.code}>var()</code>. Override a token in the
            controls panel — all dependents update immediately.
          </p>
        </header>

        {/* ------------------------- 01 Live controls ------------------------- */}
        <section id="controls" style={styles.section}>
          <SectionHead num="01" title="Live controls" />
          <div style={styles.controlGrid}>
            {editable.map(({ token, label }) => (
              <TokenPicker
                key={token}
                token={token}
                label={label}
                tick={tick}
                onChange={(val) => {
                  setRootToken(token, val);
                  bump();
                }}
              />
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearRootToken(editable.map((e) => e.token));
                bump();
              }}
            >
              Reset all overrides
            </Button>
          </div>
        </section>

        {/* ------------------------- 02 Colors ------------------------- */}
        <section id="colors" style={styles.section}>
          <SectionHead num="02" title="Colors" />

          <SubHead>Neutrals · 11 steps</SubHead>
          <div style={styles.ramp}>
            {NEUTRAL_RAMP.map((n) => (
              <Swatch
                key={`n-${n}`}
                token={`--neutral-${n}`}
                tick={tick}
                label={`neutral-${n}`}
              />
            ))}
          </div>

          <SubHead>Greens · 5 steps · accent family</SubHead>
          <div style={styles.ramp}>
            {GREEN_RAMP.map((n) => (
              <Swatch key={`g-${n}`} token={`--green-${n}`} tick={tick} label={`green-${n}`} />
            ))}
          </div>

          <SubHead>Terracotta · 3 steps · highlight family</SubHead>
          <div style={styles.ramp}>
            {TERRACOTTA_RAMP.map((n) => (
              <Swatch
                key={`t-${n}`}
                token={`--terracotta-${n}`}
                tick={tick}
                label={`terracotta-${n}`}
              />
            ))}
          </div>

          <SubHead>Semantic aliases</SubHead>
          <div style={styles.semanticGrid}>
            {SEMANTIC_COLORS.map((s) => (
              <SemanticChip
                key={s.token}
                token={s.token}
                role={s.role}
                tick={tick}
              />
            ))}
          </div>
        </section>

        {/* ------------------------- 03 Typography ------------------------- */}
        <section id="typography" style={styles.section}>
          <SectionHead num="03" title="Typography" />
          <div style={styles.typeScale}>
            {TEXT_SCALE.map((t) => (
              <TypeRow
                key={t.token}
                token={t.token}
                label={t.label}
                weight={t.weight}
                tick={tick}
              />
            ))}
          </div>
          <SubHead>Families</SubHead>
          <div style={styles.familyPreview}>
            <div>
              <div style={styles.specLabel}>--font-sans · Switzer</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 22 }}>
                Taste has to defend itself.
              </div>
            </div>
            <div>
              <div style={styles.specLabel}>--font-mono · IBM Plex Mono</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                02.A · OPENING · LIVE TOKEN
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------- 04 Spacing ------------------------- */}
        <section id="spacing" style={styles.section}>
          <SectionHead num="04" title="Spacing" />
          <div style={styles.spacingCol}>
            {SPACING_SCALE.map((n) => (
              <SpacingBar key={n} n={n} />
            ))}
          </div>
          <SubHead>Viewport-scaled (page frames)</SubHead>
          <div style={styles.vspaceNote}>
            <div>--vspace-xs · 3vh · corner label offset-y</div>
            <div>--vspace-sm · 10vh · bridge padding-y</div>
            <div>--vspace-md · 12vh · tenets top margin</div>
            <div>--vspace-lg · 18vh · footer top margin</div>
            <div>--vspace-xl · 22vh · section padding-y</div>
            <div>--hspace-xs · 4vw · corner label offset-x</div>
            <div>--hspace-sm · 8vw · section padding-x</div>
          </div>
        </section>

        {/* ------------------------- 05 Radius ------------------------- */}
        <section id="radius" style={styles.section}>
          <SectionHead num="05" title="Radius" />
          <div style={styles.radiusRow}>
            {RADIUS_SCALE.map((r) => (
              <div key={r.token} style={styles.radiusItem}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: 'var(--neutral-200)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: `var(${r.token})`,
                  }}
                />
                <div style={styles.specLabel}>{r.label}</div>
                <div style={styles.tokenName}>{r.token}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------- 06 Story components ------------------------- */}
        <section id="story" style={styles.section}>
          <SectionHead num="06" title="Story components" />

          <Specimen title="Eyebrow">
            <div
              style={{
                fontFamily: 'var(--eyebrow-font)',
                fontSize: 'var(--eyebrow-size)',
                fontWeight: 'var(--eyebrow-weight)' as never,
                letterSpacing: 'var(--eyebrow-tracking)',
                textTransform: 'uppercase',
                color: 'var(--eyebrow-color)',
              }}
            >
              Section 02 · For Business
            </div>
          </Specimen>

          <Specimen title="Headline with accent">
            <h2
              style={{
                fontFamily: 'var(--headline-font)',
                fontSize: 'var(--headline-size)',
                fontWeight: 'var(--headline-weight)' as never,
                lineHeight: 'var(--headline-leading)',
                letterSpacing: 'var(--headline-tracking)',
                color: 'var(--headline-color)',
                margin: 0,
              }}
            >
              At AppLovin,
              <br />
              design was measured in{' '}
              <span style={{ color: 'var(--headline-accent)' }}>dollars.</span>
            </h2>
          </Specimen>

          <Specimen title="Body copy (primary → dim → strong)">
            <div
              style={{
                fontFamily: 'var(--body-font)',
                fontSize: 'var(--body-size)',
                lineHeight: 'var(--body-leading)',
                color: 'var(--body-color)',
                maxWidth: 52 * 9,
              }}
            >
              The OOBE app-recommendation flow ships with{' '}
              <strong style={{ color: 'var(--body-strong-color)', fontWeight: 600 }}>
                Samsung
              </strong>
              ,{' '}
              <strong style={{ color: 'var(--body-strong-color)', fontWeight: 600 }}>
                T-Mobile
              </strong>
              , and a dozen other OEMs — reaching tens of millions of newly
              unboxed phones each quarter and contributing{' '}
              <strong style={{ color: 'var(--body-strong-color)', fontWeight: 600 }}>
                seven figures of revenue
              </strong>
              .
              <p style={{ margin: '1.75em 0 0', color: 'var(--body-dim-color)' }}>
                Every pixel is A/B tested. Taste has to defend itself.
              </p>
            </div>
          </Specimen>

          <Specimen title="Pull quote (italic)">
            <p
              style={{
                fontFamily: 'var(--pullquote-font)',
                fontStyle: 'var(--pullquote-style)' as never,
                fontSize: 'var(--pullquote-size)',
                fontWeight: 'var(--pullquote-weight)' as never,
                lineHeight: 'var(--pullquote-leading)',
                letterSpacing: 'var(--pullquote-tracking)',
                color: 'var(--pullquote-color)',
                textAlign: 'center',
                margin: 0,
              }}
            >
              &ldquo;Cleaner UI converts more.&rdquo;
            </p>
          </Specimen>

          <Specimen title="Punch block">
            <div
              style={{
                fontFamily: 'var(--punch-font)',
                fontSize: 'var(--punch-size)',
                fontWeight: 'var(--punch-weight)' as never,
                lineHeight: 'var(--punch-leading)',
                letterSpacing: 'var(--punch-tracking)',
                textAlign: 'center',
              }}
            >
              <div style={{ color: 'var(--punch-color)' }}>We tested all three.</div>
              <div style={{ color: 'var(--punch-accent-color)', marginTop: 6 }}>
                All three were wrong.
              </div>
            </div>
          </Specimen>

          <Specimen title="Rule">
            <div
              style={{
                width: '100%',
                height: 'var(--rule-height)',
                background: 'var(--rule-color)',
              }}
            />
          </Specimen>

          <Specimen title="Corner label (with meta + hint)">
            <div
              style={{
                position: 'relative',
                height: 180,
                background: 'var(--surface-1)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 'var(--corner-offset-y)',
                  left: 'var(--corner-offset-x)',
                  fontFamily: 'var(--corner-font)',
                  color: 'var(--corner-color)',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 'var(--corner-size)',
                    fontWeight: 'var(--corner-weight)' as never,
                    letterSpacing: 'var(--corner-tracking)',
                    textTransform: 'uppercase',
                    padding: 'var(--corner-padding)',
                    border: 'var(--corner-border)',
                    borderRadius: 'var(--corner-radius)',
                  }}
                >
                  02.B · THREE DESIGN TENETS
                </span>
                <div
                  style={{
                    marginTop: 10,
                    paddingLeft: 10,
                    fontSize: 'var(--corner-size)',
                    letterSpacing: '0.06em',
                    color: 'var(--corner-meta-color)',
                  }}
                >
                  ● no data yet — pure suspense
                </div>
                <div
                  style={{
                    marginTop: 4,
                    paddingLeft: 10,
                    fontSize: 'var(--corner-size)',
                    letterSpacing: '0.06em',
                    color: 'var(--corner-hint-color)',
                  }}
                >
                  ← EXPECTED / ACTUAL →
                </div>
              </div>
            </div>
          </Specimen>

          <Specimen title="Comparison card (expected vs actual)">
            <article
              style={{
                padding: 'var(--card-padding)',
                border: 'var(--card-border)',
                borderRadius: 'var(--card-radius)',
                background: 'var(--card-bg)',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 360,
              }}
            >
              <p
                style={{
                  fontSize: 'var(--card-expected-size)',
                  color: 'var(--card-expected-color)',
                  textDecoration: 'line-through',
                  marginBottom: 14,
                }}
              >
                1-step survey should win.
              </p>
              <p
                style={{
                  fontSize: 'var(--card-actual-size)',
                  fontWeight: 'var(--card-actual-weight)' as never,
                  lineHeight: 'var(--card-actual-leading)',
                  color: 'var(--card-actual-color)',
                  margin: '0 0 28px',
                }}
              >
                5-step survey drove 18% install growth vs. 14% for 1-step.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                  marginTop: 'auto',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '3 / 4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'var(--card-loser-border)',
                    borderRadius: 'var(--card-box-radius)',
                    color: 'var(--card-loser-color)',
                    background: 'var(--card-loser-bg)',
                    fontFamily: 'var(--card-box-font)',
                    fontSize: 'var(--card-box-size)',
                    letterSpacing: 'var(--card-box-tracking)',
                    textTransform: 'uppercase',
                  }}
                >
                  1 STEP
                </div>
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '3 / 4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'var(--card-winner-border)',
                    borderRadius: 'var(--card-box-radius)',
                    color: 'var(--card-winner-color)',
                    background: 'var(--card-winner-bg)',
                    fontFamily: 'var(--card-box-font)',
                    fontSize: 'var(--card-box-size)',
                    letterSpacing: 'var(--card-box-tracking)',
                    textTransform: 'uppercase',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 12,
                      fontSize: 'var(--card-winner-tag-size)',
                      fontWeight: 'var(--card-winner-tag-weight)' as never,
                      color: 'var(--card-winner-tag-color)',
                      letterSpacing: '0.14em',
                    }}
                  >
                    WINNER
                  </span>
                  5 STEPS
                </div>
              </div>
            </article>
          </Specimen>

          <Specimen title="Marker highlight · <mark> over body copy">
            <p
              style={{
                fontFamily: 'var(--body-font)',
                fontSize: 'var(--body-size)',
                lineHeight: 'var(--body-leading)',
                color: 'var(--body-color)',
                maxWidth: 52 * 9,
                margin: 0,
              }}
            >
              Every pixel is{' '}
              <mark
                style={{
                  background: 'var(--highlight-pale)',
                  color: 'var(--highlight-ink)',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 500,
                }}
              >
                A/B tested
              </mark>
              . Taste has to defend itself.
            </p>
          </Specimen>

          <Specimen title="Key statistic · --highlight on a number">
            <div
              style={{
                fontFamily: 'var(--body-font)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                lineHeight: 1.35,
                color: 'var(--ink-primary)',
              }}
            >
              5-step survey drove{' '}
              <span style={{ color: 'var(--highlight)', fontWeight: 700 }}>
                +18% install growth
              </span>{' '}
              vs. 14% for 1-step.
            </div>
          </Specimen>

          <Specimen title="Footer link">
            <a
              href="#"
              style={{
                fontFamily: 'var(--link-font)',
                fontSize: 'var(--link-size)',
                letterSpacing: 'var(--link-tracking)',
                color: 'var(--link-color)',
                textDecoration: 'underline',
                textUnderlineOffset: 'var(--link-underline-offset)',
              }}
            >
              AppLovin OOBE · 2025 · View project →
            </a>
          </Specimen>
        </section>

        {/* ------------------------- 07 Shadcn primitives ------------------------- */}
        <section id="shadcn" style={styles.section}>
          <SectionHead num="07" title="Shadcn primitives" />
          <p style={styles.sectionNote}>
            Minimal copy-paste of shadcn components in{' '}
            <code style={styles.code}>app/_lab/ui/</code>. All styles go through
            our tokens — try changing Accent above and watch these re-tint.
          </p>

          <SubHead>Buttons · variants · monochrome is default, color is opt-in</SubHead>
          <div style={styles.row}>
            <Button>Default (ink)</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="accent">Accent (opt-in)</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>

          <SubHead>Buttons · sizes</SubHead>
          <div style={styles.row}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>

          <SubHead>Badges · default fills, no outlines</SubHead>
          <div style={styles.row}>
            <Badge>Default</Badge>
            <Badge variant="ink">Ink</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="highlight">Highlight</Badge>
          </div>

          <SubHead>Card</SubHead>
          <Card style={{ maxWidth: 420 }}>
            <CardHeader>
              <CardTitle>AppLovin OOBE</CardTitle>
              <CardDescription>Design measured in dollars.</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ fontSize: 14, color: 'var(--ink-secondary)', margin: 0 }}>
                The OOBE app-recommendation flow ships with a dozen OEMs and
                contributes seven figures of revenue.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">View project</Button>
              <Button size="sm" variant="ghost">
                Skip
              </Button>
            </CardFooter>
          </Card>

          <SubHead>Input / Label</SubHead>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
            <Label>Project name</Label>
            <Input placeholder="untitled.exp" />
          </div>

          <SubHead>Separator</SubHead>
          <div style={{ maxWidth: 320, fontSize: 14, color: 'var(--ink-secondary)' }}>
            <div>Above</div>
            <Separator style={{ margin: '12px 0' }} />
            <div>Below</div>
          </div>
        </section>

        {/* ------------------------- 08 Stages ------------------------- */}
        <section id="stages" style={styles.section}>
          <SectionHead num="08" title="Stages" />
          <div style={styles.stageRow}>
            <StageDemo mode="light" />
            <StageDemo mode="dark" />
          </div>
        </section>

        <footer style={styles.footer}>
          <span>tokens.css · v0.1</span>
          <span>·</span>
          <a href="/" style={{ color: 'inherit' }}>← back to story</a>
        </footer>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div style={styles.sectionHead}>
      <span style={styles.sectionNum}>{num}</span>
      <h2 style={styles.sectionTitle}>{title}</h2>
    </div>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return <div style={styles.subhead}>{children}</div>;
}

function Specimen({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={styles.specimen}>
      <div style={styles.specimenLabel}>{title}</div>
      <div style={styles.specimenBox}>{children}</div>
    </div>
  );
}

function Swatch({ token, label, tick }: { token: string; label: string; tick: number }) {
  const v = useResolvedToken(token, tick);
  const light = isLightColor(v);
  return (
    <div style={styles.swatch}>
      <div
        style={{
          ...styles.swatchChip,
          background: `var(${token})`,
          color: light ? 'var(--neutral-950)' : 'var(--neutral-50)',
          borderColor: light ? 'var(--border-hairline)' : 'transparent',
        }}
      >
        <span style={styles.swatchHex}>{v || '…'}</span>
      </div>
      <div style={styles.swatchLabel}>{label}</div>
    </div>
  );
}

function SemanticChip({ token, role, tick }: { token: string; role: string; tick: number }) {
  const v = useResolvedToken(token, tick);
  return (
    <div style={styles.semanticChip}>
      <div
        style={{
          width: 44,
          height: 44,
          background: `var(${token})`,
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-sm)',
          flex: '0 0 auto',
        }}
      />
      <div>
        <div style={styles.semanticToken}>{token}</div>
        <div style={styles.semanticRole}>{role}</div>
        <div style={styles.semanticHex}>{v || '…'}</div>
      </div>
    </div>
  );
}

function TokenPicker({
  token,
  label,
  tick,
  onChange,
}: {
  token: string;
  label: string;
  tick: number;
  onChange: (v: string) => void;
}) {
  const resolved = useResolvedToken(token, tick);
  /* Color inputs must take #rrggbb. Try to coerce — falls back to black if
     computed value is already var() chain or rgba(). */
  const hex = toHex(resolved) ?? '#000000';
  return (
    <div style={styles.pickerRow}>
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(e.target.value)}
        style={styles.colorInput}
      />
      <div style={{ minWidth: 0 }}>
        <div style={styles.pickerLabel}>{label}</div>
        <div style={styles.pickerToken}>
          {token} · <span style={{ color: 'var(--ink-primary)' }}>{resolved}</span>
        </div>
      </div>
    </div>
  );
}

function TypeRow({
  token,
  label,
  weight,
  tick,
}: {
  token: string;
  label: string;
  weight?: number;
  tick: number;
}) {
  const v = useResolvedToken(token, tick);
  return (
    <div style={styles.typeRow}>
      <div style={styles.typeMeta}>
        <div style={styles.typeToken}>{token}</div>
        <div style={styles.typeLabel}>{label}</div>
        <div style={styles.typeResolved}>{v || '…'}</div>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: `var(${token})`,
          fontWeight: weight ?? 400,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          color: 'var(--ink-primary)',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        Taste has to defend itself.
      </div>
    </div>
  );
}

function SpacingBar({ n }: { n: number }) {
  return (
    <div style={styles.spacingRow}>
      <div style={styles.spacingLabel}>--space-{n}</div>
      <div
        style={{
          height: 14,
          background: 'var(--accent)',
          width: `var(--space-${n})`,
          borderRadius: 'var(--radius-sm)',
        }}
      />
      <div style={styles.spacingPx}>{resolveSpace(n)}</div>
    </div>
  );
}

function StageDemo({ mode }: { mode: 'light' | 'dark' }) {
  return (
    <div
      className={mode === 'dark' ? 'stage-dark' : 'stage-light'}
      style={{
        flex: 1,
        minHeight: 220,
        padding: 32,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-hairline)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.6,
          marginBottom: 16,
        }}
      >
        {mode === 'dark' ? '.stage-dark' : '.stage-light'}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}
      >
        Taste has to
        <br />
        defend itself.
      </div>
      <div style={{ marginTop: 16, fontSize: 14, opacity: 0.8 }}>
        Body tone on this stage is auto-set by the .stage-{mode} utility class.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isLightColor(hex: string) {
  const h = toHex(hex);
  if (!h) return false;
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55;
}

function toHex(v: string): string | null {
  if (!v) return null;
  const s = v.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(s)) return s;
  if (/^#[0-9a-f]{3}$/.test(s)) {
    return '#' + s.slice(1).split('').map((c) => c + c).join('');
  }
  const m = s.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const parts = m[1].split(',').map((p) => p.trim());
    if (parts.length >= 3) {
      const [r, g, b] = parts.slice(0, 3).map((p) => parseInt(p, 10));
      return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
    }
  }
  return null;
}

function resolveSpace(n: number) {
  const map: Record<number, string> = {
    1: '4px', 2: '8px', 3: '16px', 4: '24px',
    5: '40px', 6: '64px', 7: '96px', 8: '144px',
  };
  return map[n] ?? '';
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    minHeight: '100vh',
    background: 'var(--stage-light)',
    color: 'var(--ink-primary)',
    fontFamily: 'var(--font-sans)',
  },
  toc: {
    position: 'sticky',
    top: 0,
    alignSelf: 'start',
    height: '100vh',
    padding: '40px 24px',
    background: 'var(--surface-1)',
  },
  tocTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--ink-muted)',
    marginBottom: 20,
  },
  tocList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  tocLink: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-secondary)',
    textDecoration: 'none',
    letterSpacing: '0.06em',
  },
  main: { padding: '40px 56px 120px', maxWidth: 1200 },
  header: { marginBottom: 64 },
  eyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--ink-muted)',
    marginBottom: 14,
  },
  h1: {
    fontSize: 40,
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
    margin: 0,
  },
  lede: {
    marginTop: 14,
    maxWidth: 640,
    fontSize: 15,
    lineHeight: 1.6,
    color: 'var(--ink-secondary)',
  },
  code: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    padding: '2px 6px',
    background: 'var(--neutral-100)',
    borderRadius: 3,
    color: 'var(--ink-primary)',
  },
  section: {
    scrollMarginTop: 24,
    padding: '96px 0 48px',
  },
  sectionHead: { display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 28 },
  sectionNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '0.22em',
    color: 'var(--ink-muted)',
  },
  sectionTitle: { fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 },
  sectionNote: {
    fontSize: 14,
    lineHeight: 1.6,
    color: 'var(--ink-secondary)',
    margin: '0 0 24px',
    maxWidth: 640,
  },
  subhead: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ink-muted)',
    margin: '28px 0 14px',
  },
  ramp: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: 6,
    marginBottom: 24,
  },
  swatch: { display: 'flex', flexDirection: 'column', gap: 6 },
  swatchChip: {
    height: 76,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid',
    display: 'flex',
    alignItems: 'flex-end',
    padding: 8,
  },
  swatchHex: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.04em',
  },
  swatchLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--ink-muted)',
    letterSpacing: '0.04em',
  },
  semanticGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 12,
  },
  semanticChip: {
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
    padding: 20,
    borderRadius: 'var(--radius-lg)',
    background: 'var(--surface-1)',
  },
  semanticToken: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-primary)',
    fontWeight: 500,
  },
  semanticRole: { fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 },
  semanticHex: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--ink-faint)',
    marginTop: 4,
  },
  typeScale: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    background: 'var(--surface-1)',
  },
  typeRow: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    alignItems: 'center',
    gap: 24,
    padding: '20px 24px',
  },
  typeMeta: { display: 'flex', flexDirection: 'column', gap: 2 },
  typeToken: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-primary)',
  },
  typeLabel: { fontSize: 12, color: 'var(--ink-muted)' },
  typeResolved: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--ink-faint)',
  },
  familyPreview: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginTop: 12,
  },
  specLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.12em',
    color: 'var(--ink-muted)',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  tokenName: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--ink-faint)',
  },
  controlGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20,
    padding: 28,
    borderRadius: 'var(--radius-lg)',
    background: 'var(--surface-1)',
  },
  pickerRow: { display: 'flex', gap: 14, alignItems: 'center' },
  colorInput: {
    width: 48,
    height: 48,
    padding: 0,
    border: '1px solid var(--border-hairline)',
    borderRadius: 'var(--radius-md)',
    background: 'transparent',
    cursor: 'pointer',
    flex: '0 0 auto',
  },
  pickerLabel: { fontSize: 13, color: 'var(--ink-primary)', fontWeight: 500 },
  pickerToken: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--ink-faint)',
    marginTop: 2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  spacingCol: { display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 },
  spacingRow: { display: 'grid', gridTemplateColumns: '90px 1fr 60px', alignItems: 'center', gap: 12 },
  spacingLabel: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)' },
  spacingPx: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)', textAlign: 'right' },
  vspaceNote: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink-secondary)',
    padding: 24,
    borderRadius: 'var(--radius-lg)',
    background: 'var(--surface-1)',
  },
  radiusRow: { display: 'flex', flexWrap: 'wrap', gap: 20 },
  radiusItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  specimen: { marginBottom: 28 },
  specimenLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.12em',
    color: 'var(--ink-muted)',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  specimenBox: {
    padding: '40px 0',
    background: 'transparent',
  },
  row: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' },
  stageRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  footer: {
    display: 'flex',
    gap: 10,
    marginTop: 120,
    paddingTop: 32,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.08em',
    color: 'var(--ink-faint)',
  },
};
