import { Link } from 'react-router-dom';
import FavoriteButton from '../common/FavoriteButton.jsx';

// Strip parenthetical clarifiers like "(Kiril)" or "(rivoyatga ko'ra)" for
// the spine — narrow space, and the detail page still shows the full string.
function spineText(s) {
  return (s || '').replace(/\s*\([^)]*\)\s*/g, ' ').trim();
}

export default function BookSpine({ book, index = 0, height = 380 }) {
  // Spine thickness still scales with page count, but the baseline is bumped
  // (was 48 + sqrt(pages)*3 → now 70 + sqrt(pages)*3) so horizontal title
  // text has room to wrap into two readable lines instead of getting jammed
  // onto a tiny vertical strip. Range is now ~89-149 px.
  const pages = Math.max(40, Math.min(book.pages || 200, 700));
  const w = Math.round(70 + Math.sqrt(pages) * 3);

  const title = spineText(book.title);
  const author = spineText(book.author);

  // Top: initial monogram. Heart sits in the top-right corner so it doesn't
  // cover the title (the previous bug — "XAMSA" rendered as "AMSA").
  const TOP_RESERVE = 58;
  const BOTTOM_RESERVE = 14;
  const GAP = 8;
  const textZone = Math.max(140, height - TOP_RESERVE - BOTTOM_RESERVE);
  const titleZone = Math.round((textZone - GAP) * 0.55);
  const authorZone = textZone - GAP - titleZone;

  return (
    <Link
      to={`/kitoblar/${book.slug}`}
      className="group inline-block reveal align-bottom"
      data-reveal-delay={index * 60}
      style={{ width: w + 'px', height: height + 'px' }}
    >
      <article
        className="relative w-full h-full rounded-t-sm overflow-hidden border border-gold/20 group-hover:border-gold/80 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
        style={{
          background: `linear-gradient(180deg, ${book.accent} 0%, ${book.accent}cc 50%, var(--bg-deep) 100%)`,
        }}
      >
        {/* Decorative bands */}
        <span className="absolute top-2 inset-x-2 h-px bg-gold/40" />
        <span className="absolute top-4 inset-x-2 h-px bg-gold/30" />
        <span className="absolute bottom-2 inset-x-2 h-px bg-gold/40" />
        <span className="absolute bottom-4 inset-x-2 h-px bg-gold/30" />

        {/* Initial — central monogram at the top */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 font-serif text-2xl text-gold/90 font-medium">
          {book.initial}
        </div>

        {/* Title — horizontal text, wraps onto multiple lines if long.
            Grid place-items-center keeps it dead-center horizontally and
            vertically inside the zone, regardless of how many lines wrap. */}
        <div
          className="absolute inset-x-2 grid place-items-center overflow-hidden"
          style={{ top: TOP_RESERVE + 'px', height: titleZone + 'px' }}
        >
          <div
            className="font-serif text-cream tracking-wide text-center"
            style={{ fontSize: '14px', lineHeight: '1.18' }}
          >
            {title.toUpperCase()}
          </div>
        </div>

        {/* Author — horizontal, smaller, also wraps */}
        <div
          className="absolute inset-x-2 grid place-items-center overflow-hidden"
          style={{ bottom: BOTTOM_RESERVE + 'px', height: authorZone + 'px' }}
        >
          <div
            className="font-amiri text-gold/80 tracking-[1px] uppercase text-center"
            style={{ fontSize: '11px', lineHeight: '1.25' }}
          >
            {author}
          </div>
        </div>

        {/* Favorite — top-right corner, scaled smaller */}
        <div className="absolute top-1.5 right-1.5 z-10 scale-[0.72] origin-top-right">
          <FavoriteButton section="kitoblar" itemId={book.id} size="sm" />
        </div>
      </article>
    </Link>
  );
}
