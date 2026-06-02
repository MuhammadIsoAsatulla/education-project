import { Link } from 'react-router-dom';
import SmartImage from '../common/SmartImage.jsx';
import FavoriteButton from '../common/FavoriteButton.jsx';

/**
 * Portrait card for an alloma (or a jadid — same component, different basePath).
 *
 * Visual direction: the painted portrait is the hero. Everything else (era,
 * name, years, CTA) is caption-level information that supports the image —
 * no corner ornaments, no bordered chips, no italic decoration competing for
 * attention. Hover lifts the card and reveals the gold accent on the action.
 */
export default function AllomaCard({ alloma, index = 0, basePath = '/allomalar', section = 'allomalar' }) {
  return (
    <Link
      to={`${basePath}/${alloma.slug}`}
      className="group relative block reveal w-full max-w-[440px] mx-auto"
      data-reveal-delay={index * 60}
    >
      <article
        className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.06] hover:border-gold/30 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 bg-bg-mid"
        style={{
          boxShadow:
            '0 24px 48px -16px rgba(0,0,0,0.55), 0 4px 14px -6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Portrait — fills the card, anchored at top so faces stay visible */}
        <SmartImage
          src={alloma.image}
          alt={alloma.name}
          initial={alloma.initial}
          accent={alloma.accent}
          objectPosition={alloma.imagePosition || 'center top'}
          className="absolute inset-0"
          imgClassName="transition-transform duration-[1200ms] group-hover:scale-[1.04]"
        />

        {/* Soft top vignette — keeps the era caption legible without a chip */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[28%] pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,18,30,0.55) 0%, rgba(8,18,30,0.15) 60%, transparent 100%)',
          }}
        />

        {/* Bottom content gradient — denser at the very bottom so name + CTA
            sit on a quiet surface; fades to clear over ~50 % of the card so
            the portrait reads. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[58%] pointer-events-none"
          style={{
            background:
              'linear-gradient(0deg, rgba(8,18,30,0.96) 0%, rgba(8,18,30,0.78) 35%, rgba(8,18,30,0.30) 70%, transparent 100%)',
          }}
        />

        {/* Top-left: era badge. Tight glass-pill — backdrop-blur over a dark
            translucent fill with a hairline border. Reads cleanly on light
            painted portraits (Beruniy's lit room, etc.) as well as dark
            ones, without the smudge-y look of a blurred halo. */}
        <span className="absolute top-3 left-3 z-10 inline-flex items-center px-2.5 py-1 rounded-md bg-bg-deep/55 backdrop-blur-md border border-white/[0.08] text-gold/95 text-[10px] tracking-[3.5px] uppercase font-medium">
          {alloma.era}
        </span>

        {/* Top-right: favorite — kept compact, opacity rises on card hover */}
        <div className="absolute top-3.5 right-3.5 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
          <FavoriteButton section={section} itemId={alloma.id} />
        </div>

        {/* Bottom placard — pinned to the bottom of the cover image via
            absolute positioning so it always sits on the dark gradient
            regardless of card height. Short by design (name + years only)
            so it reads as a museum label, not a content overlay. */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 md:p-6 text-center pointer-events-none">
          <h3
            className="font-serif text-cream leading-tight group-hover:text-gold-bright transition-colors duration-300"
            style={{
              fontSize: 'clamp(18px, 2vw, 24px)',
              textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.85)',
            }}
          >
            {alloma.name}
          </h3>
          {alloma.years ? (
            <p
              className="text-cream-soft/80 text-[11px] tracking-[2.5px] mt-1.5"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
            >
              {alloma.years}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
