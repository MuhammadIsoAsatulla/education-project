import { Link } from 'react-router-dom';
import SmartImage from '../common/SmartImage.jsx';
import FavoriteButton from '../common/FavoriteButton.jsx';

/**
 * Museum card. Shares the restraint pass with the Alloma cards: hairline
 * border, layered shadow with inset top highlight, rounded-2xl corners, no
 * em-dashes around labels. Hover / image-scale animations preserved per
 * design direction — only the "corner" treatment changed.
 */
export default function MuseumCard({ muzey, index = 0 }) {
  const isAvailable = muzey.status === 'available';

  return (
    <Link
      to={isAvailable ? `/muzeylar/${muzey.slug}` : '#'}
      onClick={(e) => !isAvailable && e.preventDefault()}
      className={`group relative block reveal ${!isAvailable ? 'cursor-not-allowed' : ''}`}
      data-reveal-delay={index * 100}
    >
      <article
        className="relative h-[420px] sm:h-[480px] xl:h-[420px] overflow-hidden rounded-2xl border border-white/[0.06] hover:border-gold/30 transition-all duration-700"
        style={{
          boxShadow:
            '0 24px 48px -16px rgba(0,0,0,0.55), 0 4px 14px -6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <SmartImage
          src={muzey.image}
          alt={muzey.name}
          initial={muzey.initial}
          accent={muzey.accent}
          className="absolute inset-0"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />

        {/* Favorite button top-right — opacity rises on hover, no heavy backdrop. */}
        <div className="absolute top-4 right-4 z-20 opacity-70 group-hover:opacity-100 transition-opacity">
          <FavoriteButton section="muzeylar" itemId={muzey.id} />
        </div>

        {/* Gradient overlay — keeps text legible without competing with the image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(0deg, rgba(8,18,30,0.92) 0%, rgba(8,18,30,0.55) 35%, rgba(8,18,30,0.10) 65%, transparent 100%)',
          }}
        />

        {/* Bottom placard — pinned to the bottom of the cover image so it
            always sits on the dark gradient. Short museum-label style:
            name + city only. */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 md:p-6 text-center pointer-events-none">
          {!isAvailable && (
            <span
              className="block text-cream-soft/70 text-[9px] tracking-[2.5px] uppercase mb-2"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
            >
              Tez orada
            </span>
          )}
          <h3
            className="font-serif text-cream leading-tight group-hover:text-gold-bright transition-colors duration-500"
            style={{
              fontSize: 'clamp(18px, 2vw, 24px)',
              textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.85)',
            }}
          >
            {muzey.name}
          </h3>
          {muzey.city ? (
            <p
              className="text-cream-soft/80 text-[11px] tracking-[2.5px] uppercase mt-1.5"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
            >
              {muzey.city}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
