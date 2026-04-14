import Image from 'next/image';
import type { MaskConfig } from './MaskControls';
import {
  NAV, HERO, STORY, SERVICES, TESTIMONIALS, JOURNEY, PROJECT_GRID, FOOTER,
} from './portfolioData';

export default function PortfolioContent({ config }: { config: MaskConfig }) {
  const c = config.textColor;

  return (
    <div style={{ color: c }}>
      {/* ===== Nav ===== */}
      <nav className="fl-nav" style={{ borderBottom: `1px solid ${c}` }}>
        <span data-fl-text style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.02em' }}>
          {NAV.name}&reg;
        </span>
        <div className="fl-nav-links">
          {NAV.links.map((l) => (
            <span key={l} data-fl-text style={{ color: c }}>{l}</span>
          ))}
        </div>
        <span
          data-fl-text
          data-fl-border
          className="fl-nav-cta"
          style={{ color: c, borderColor: c }}
        >
          {NAV.cta}
        </span>
      </nav>

      {/* ===== Hero ===== */}
      <section className="fl-section">
        <div className="fl-hero-grid">
          <div>
            <h1 data-fl-text className="fl-hero-headline" style={{ color: c }}>
              {HERO.headline}
            </h1>
          </div>
          <div className="fl-hero-portrait" data-fl-image style={{ border: `1px solid ${c}` }}>
            <Image src={HERO.portrait} alt="Portrait" fill className="object-cover" sizes="40vw" />
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <span data-fl-text style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: c }}>
            {HERO.aboutLabel}
          </span>
          <p data-fl-text className="fl-about-text" style={{ color: c }}>
            {HERO.aboutText}
          </p>
        </div>
      </section>

      {/* ===== Divider ===== */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 60px' }}>
        <div data-fl-border style={{ borderTop: `1px solid ${c}` }} />
      </div>

      {/* ===== Story ===== */}
      <section className="fl-section">
        <span
          data-fl-text
          data-fl-border
          className="fl-story-year"
          style={{ color: c, borderColor: c, marginBottom: 32, display: 'inline-block' }}
        >
          {STORY.label}
        </span>

        <div className="fl-story-quote" style={{ color: c, marginTop: 32 }}>
          {STORY.quoteParts.map((p, i) => (
            <span key={i} data-fl-text className={p.style === 'serif' ? 'serif' : ''}>
              {p.text}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <span data-fl-text data-fl-border className="fl-story-year" style={{ color: c, borderColor: c }}>
            {STORY.yearRange}
          </span>
        </div>

        <div className="fl-story-body">
          <div>
            <p data-fl-text className="fl-story-desc" style={{ color: c }}>
              {STORY.description}
            </p>
            <ul className="fl-story-bullets" style={{ color: c }}>
              {STORY.bullets.map((b, i) => (
                <li key={i} data-fl-text>{b}</li>
              ))}
            </ul>
          </div>
          <div className="fl-story-photo" data-fl-image>
            <Image src={STORY.photo} alt="Lifestyle" fill className="object-cover" sizes="40vw" />
          </div>
        </div>
      </section>

      {/* ===== Divider ===== */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 60px' }}>
        <div data-fl-border style={{ borderTop: `1px solid ${c}` }} />
      </div>

      {/* ===== Services ===== */}
      <section className="fl-section">
        <span data-fl-text data-fl-border className="fl-story-year" style={{ color: c, borderColor: c, marginBottom: 40, display: 'inline-block' }}>
          What I Create
        </span>
        <div className="fl-services-grid" style={{ marginTop: 32 }}>
          {SERVICES.map((s, i) => (
            <div key={i} data-fl-border className="fl-service-card" style={{ borderColor: c }}>
              <div data-fl-border className="fl-service-icon" style={{ borderColor: c, color: c }}>
                {i === 0 ? '🔍' : i === 1 ? '📐' : '⚡'}
              </div>
              <div data-fl-text className="fl-service-title" style={{ color: c }}>{s.title}</div>
              <div data-fl-text className="fl-service-desc" style={{ color: c }}>{s.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="fl-section">
        <span data-fl-text data-fl-border className="fl-story-year" style={{ color: c, borderColor: c, marginBottom: 40, display: 'inline-block' }}>
          Words from My Clients
        </span>
        <div className="fl-testimonial-grid" style={{ marginTop: 32 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="fl-testimonial-card" data-fl-border style={{ '--fl-border-color': c } as React.CSSProperties}>
              <span className="corner-bl" />
              <span className="corner-br" />
              <p data-fl-text className="fl-testimonial-quote" style={{ color: c }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div data-fl-text className="fl-testimonial-author" style={{ color: c }}>{t.author}</div>
              <div data-fl-text className="fl-testimonial-role" style={{ color: c }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Journey ===== */}
      <section className="fl-section">
        <span data-fl-text data-fl-border className="fl-story-year" style={{ color: c, borderColor: c, marginBottom: 40, display: 'inline-block' }}>
          {JOURNEY.label}
        </span>
        <div className="fl-journey-grid" style={{ marginTop: 32 }}>
          <div>
            <p data-fl-text className="fl-story-desc" style={{ color: c, marginBottom: 32 }}>
              {JOURNEY.description}
            </p>
            <div className="fl-journey-table">
              {JOURNEY.experience.map((e, i) => (
                <div key={i} data-fl-border className="fl-journey-row" style={{ borderBottomColor: c, color: c }}>
                  <span data-fl-text className="fl-journey-company">{e.company}</span>
                  <span data-fl-text className="fl-journey-role">{e.role}</span>
                  <span data-fl-text className="fl-journey-years">{e.years}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="fl-stats">
            {JOURNEY.stats.map((s, i) => (
              <div key={i}>
                <div data-fl-text className="fl-stat-value" style={{ color: c }}>{s.value}</div>
                <div data-fl-text className="fl-stat-label" style={{ color: c }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Project Grid ===== */}
      <section className="fl-section">
        <div className="fl-project-grid">
          {PROJECT_GRID.map((p, i) => (
            <div key={i} data-fl-image className="fl-project-item">
              <Image src={p.image} alt={p.title} fill className="object-cover" sizes="45vw" />
            </div>
          ))}
          <span data-fl-text data-fl-border className="fl-project-cta" style={{ color: c, borderColor: c }}>
            Let&apos;s Connect
          </span>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="fl-footer" data-fl-border style={{ borderTopColor: c }}>
        <div className="fl-footer-grid">
          <div>
            <div data-fl-text className="fl-footer-message" style={{ color: c }}>
              {FOOTER.message}
            </div>
            <div data-fl-text className="fl-footer-subtitle" style={{ color: c }}>
              {FOOTER.subtitle}
            </div>
          </div>
          <div>
            <div data-fl-text className="fl-footer-label" style={{ color: c }}>Quick Links</div>
            <ul className="fl-footer-links" style={{ color: c }}>
              {FOOTER.quickLinks.map((l) => (
                <li key={l} data-fl-text>{l}</li>
              ))}
            </ul>
          </div>
          <div>
            <div data-fl-text className="fl-footer-label" style={{ color: c }}>Follow Me</div>
            <ul className="fl-footer-links" style={{ color: c }}>
              {FOOTER.socialLinks.map((l) => (
                <li key={l} data-fl-text>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
