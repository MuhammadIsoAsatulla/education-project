import { Link } from 'react-router-dom';
import allomalar from '../../data/allomalar.json';
import SmartImage from '../common/SmartImage.jsx';

/**
 * "Bugungi Alloma" — a daily-rotating featured figure.
 *
 * Visual direction: same restraint as the home sections grid. No teal-gradient
 * background break, no em-dash eyebrows, no double border on the portrait, no
 * italic quote, no medieval-frame ornament. The section reads as a continuation
 * of the page surface, lifted only by a soft warm radial glow and a single
 * top hairline that hints "new section starts here."
 */

function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

export default function DailyFigure() {
  const figure = allomalar[dayOfYear() % allomalar.length];

  return (
    <section className="relative px-4 sm:px-6 md:px-10 py-24 sm:py-28 overflow-hidden">
      {/* Soft warm wash behind the portrait — subtle, not theatrical. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 28% 50%, rgba(212,165,116,0.07), transparent 60%)',
        }}
      />
      {/* Hairline accents at the top and bottom — quiet section breaks. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.18), transparent)' }}
      />

      <div className="relative max-w-[1100px] mx-auto grid lg:grid-cols-[380px_1fr] gap-10 lg:gap-16 items-center">
        {/* Portrait */}
        <div
          className="reveal aspect-[3/4] max-h-[460px] mx-auto lg:mx-0 max-w-[280px] sm:max-w-[340px] lg:max-w-none relative overflow-hidden rounded-2xl border border-white/[0.06]"
          style={{
            boxShadow:
              '0 32px 64px -16px rgba(0,0,0,0.55), 0 4px 14px -6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <SmartImage
            src={figure.image}
            alt={figure.name}
            initial={figure.initial}
            accent={figure.accent}
            objectPosition={figure.imagePosition || 'center top'}
          />
          {/* Soft top vignette — keeps the caption legible without a chip */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[28%] pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(8,18,30,0.55) 0%, rgba(8,18,30,0.10) 60%, transparent 100%)',
            }}
          />
          {/* Bottom gradient — extends so the name caption can sit on it */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[35%] pointer-events-none"
            style={{
              background:
                'linear-gradient(0deg, rgba(8,18,30,0.85) 0%, rgba(8,18,30,0.40) 50%, transparent 100%)',
            }}
          />
          {/* Quiet caption — no em-dashes, no chip background */}
          <span className="absolute top-4 left-5 text-gold/85 text-[10px] tracking-[3.5px] uppercase font-medium z-10">
            Bugungi Alloma
          </span>
        </div>

        {/* Text */}
        <div className="reveal" data-reveal-delay="120">
          <span
            aria-hidden="true"
            className="block w-12 h-px bg-gold/40 mb-5 sm:mb-6"
          />
          <p className="text-gold/75 text-[11px] tracking-[5px] uppercase font-medium mb-4">
            Bugungi Alloma
          </p>
          <h2
            className="font-serif text-cream leading-[1.05] mb-3"
            style={{ fontSize: 'clamp(24px, 4.5vw, 56px)' }}
          >
            {figure.name}
          </h2>
          <p className="text-cream-soft/55 text-sm tracking-[2px] mb-7">
            {figure.years}
          </p>

          {/* Quote — no italic, no gold left bar; just the words, in a readable size. */}
          {figure.quote ? (
            <blockquote className="font-serif text-cream/90 leading-snug mb-7 max-w-xl"
                        style={{ fontSize: 'clamp(18px, 1.6vw, 22px)' }}>
              {`"${figure.quote}"`}
            </blockquote>
          ) : null}

          {figure.shortBio ? (
            <p className="text-cream-soft/70 text-[15px] leading-relaxed mb-8 max-w-xl">
              {figure.shortBio}
            </p>
          ) : null}

          <Link to={`/allomalar/${figure.slug}`} className="gold-cta">
            <span>Batafsil Tanishish</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
