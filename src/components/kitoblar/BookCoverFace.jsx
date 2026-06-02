import { useState } from 'react';

/**
 * BookCoverFace — a premium book cover.
 *
 * If the book has a real cover image (book.cover) it is shown full-bleed with a
 * thin gold frame. If the image is missing or fails to load, it gracefully
 * falls back to an elegant CSS cover whose title is ALWAYS horizontal and
 * readable. Shared by the shelf (BookCover) and the FeaturedBook hero.
 */

const NAVY = [7, 19, 31];

/** Mix a hex accent toward deep navy to build the fallback's lower gradient. */
export function shade(hex, amt = 0.74) {
  const c = (hex || '#d4a574').replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const mix = (x, y) => Math.round(x * (1 - amt) + y * amt);
  return `rgb(${mix(r, NAVY[0])}, ${mix(g, NAVY[1])}, ${mix(b, NAVY[2])})`;
}

export default function BookCoverFace({ book, lit = false, large = false }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showImage = book.cover && !failed;
  const radius = large ? 6 : 3;

  const boxShadow = lit
    ? large
      ? '0 40px 72px -16px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(212,165,116,0.55)'
      : '-6px 10px 30px -8px rgba(0,0,0,0.55), 0 34px 60px -16px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(212,165,116,0.6)'
    : large
    ? '0 24px 50px -16px rgba(0,0,0,0.6)'
    : '-11px 7px 24px -8px rgba(0,0,0,0.5), 0 14px 30px -12px rgba(0,0,0,0.5)';

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        borderRadius: radius,
        boxShadow,
        transition: 'box-shadow 0.45s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Fallback always rendered underneath while loading — keeps the shelf
          slot filled during scroll so books never appear as blank rectangles. */}
      {(!showImage || !loaded) && <FallbackFace book={book} large={large} />}
      {showImage && (
        <>
          <img
            src={book.cover}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.35s ease' }}
            draggable="false"
          />
          {/* gold frame + soft bottom vignette */}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 0 1px rgba(212,165,116,0.4)',
              background: 'linear-gradient(180deg, transparent 62%, rgba(4,12,20,0.32) 100%)',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />
        </>
      )}

      {/* Hover lighting sweep (shared) */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: lit ? 1 : 0,
          transition: 'opacity 0.5s ease',
          background:
            'linear-gradient(125deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.05) 34%, transparent 60%)',
        }}
      />
    </div>
  );
}

/** Elegant CSS cover used when no artwork is available. */
function FallbackFace({ book, large }) {
  const a = book.accent || '#d4a574';
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(158deg, ${a} 0%, ${a}d9 36%, ${shade(a)} 100%)` }}
      />
      <span className="absolute left-0 inset-y-0 w-[7px] bg-gradient-to-r from-black/40 to-transparent" />
      <span className="absolute left-[7px] inset-y-0 w-px bg-gold/25" />
      <span
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '82%',
          background:
            'linear-gradient(180deg, transparent 0%, rgba(6,16,26,0.5) 52%, rgba(6,16,26,0.82) 100%)',
        }}
      />
      <div
        className="relative h-full flex flex-col items-center text-center"
        style={{ padding: large ? '26px 22px 22px' : '18px 12px 14px' }}
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className={`block h-px bg-gold/55 ${large ? 'w-14' : 'w-9'}`} />
          <span
            className="font-serif text-gold-bright leading-none"
            style={{ fontSize: large ? 30 : 18, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            {book.initial}
          </span>
          <span className={`block h-px bg-gold/55 ${large ? 'w-14' : 'w-9'}`} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <h3
            className="font-serif font-medium text-cream"
            style={{
              fontSize: large ? 'clamp(22px, 2.1vw, 30px)' : 'clamp(15px, 1.05vw, 19px)',
              lineHeight: 1.14,
              letterSpacing: '0.3px',
              textShadow: '0 2px 12px rgba(0,0,0,0.75)',
            }}
          >
            {book.title}
          </h3>
        </div>
        <div className="mt-auto w-full">
          <span className={`block h-px bg-gold/40 mx-auto mb-2 ${large ? 'w-12' : 'w-8'}`} />
          <p
            className="font-amiri text-gold-bright/90 uppercase"
            style={{ fontSize: large ? 12 : 9.5, letterSpacing: large ? '2.5px' : '1.4px' }}
          >
            {book.author}
          </p>
          <p className="text-cream-soft/55" style={{ fontSize: large ? 11 : 9, marginTop: 2 }}>
            {book.year}
          </p>
        </div>
      </div>
    </>
  );
}
