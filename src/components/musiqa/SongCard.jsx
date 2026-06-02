import { Link } from 'react-router-dom';
import SmartImage from '../common/SmartImage.jsx';
import FavoriteButton from '../common/FavoriteButton.jsx';

/**
 * Song card. Same restraint pass as the other content cards:
 *   - rounded-2xl corners
 *   - hairline border (white at 6 %) → gold/30 on hover
 *   - layered shadow with inset top highlight
 *   - no em-dashes around the genre line
 *   - "Batafsil" is now a quiet inline link, not a loud bordered pill
 *
 * The interactive hover overlay (dim + play button) and image-scale animation
 * are preserved exactly as before per the design constraint.
 */
export default function SongCard({ song, onOpen, index = 0 }) {
  const youtubeAvailable = !!(song.youtubeId || song.youtubeQuery);

  return (
    <div className="group relative text-left reveal w-full" data-reveal-delay={index * 80}>
      <button
        onClick={() => onOpen(song)}
        className="block w-full text-left"
        aria-label={`Karaoke: ${song.title}`}
      >
        <div
          className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06] group-hover:border-gold/30 transition-all duration-500 mb-4"
          style={{
            boxShadow:
              '0 18px 36px -12px rgba(0,0,0,0.5), 0 4px 10px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <SmartImage src={song.image} alt={song.title} initial={song.initial} accent={song.accent} />

          {/* Hover overlay with play — unchanged */}
          <div className="absolute inset-0 bg-bg-deep/0 group-hover:bg-bg-deep/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-16 h-16 rounded-full bg-gold text-bg-deep flex items-center justify-center group-hover:scale-110 transition">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Duration — quiet caption, no chip frame */}
          {song.duration && song.duration !== '—' && (
            <span className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-bg-deep/65 backdrop-blur-sm text-gold/85 text-[10px] tracking-[2px] uppercase">
              {song.duration}
            </span>
          )}
          {!youtubeAvailable && !song.audio && (
            <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-bg-deep/65 backdrop-blur-sm text-cream-soft/65 text-[9px] tracking-[2px] uppercase">
              Tez orada
            </span>
          )}

          {/* Favorite — sits at low opacity, lifts on card hover */}
          <div
            className="absolute top-3 right-3 z-20 opacity-70 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <FavoriteButton section="musiqa" itemId={song.id} size="sm" />
          </div>
        </div>

        <div>
          <h3 className="font-serif text-cream text-xl group-hover:text-gold-bright transition-colors leading-tight mb-1">
            {song.title}
          </h3>
          <p className="text-cream-soft/85 text-sm">{song.artist}</p>
          <p className="text-gold/60 text-[10px] tracking-[3px] uppercase mt-1.5 font-medium">
            {song.genre}
          </p>
        </div>
      </button>

      {/* Quiet text link instead of a loud bordered pill. The arrow gives
          enough affordance; no need for a button shape next to the title. */}
      <Link
        to={`/musiqa/${song.slug}`}
        className="inline-flex items-center gap-1.5 mt-3 text-gold/80 hover:text-gold-bright text-[12px] font-medium transition-colors"
      >
        <span>Batafsil</span>
        <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-2.5">
          <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
        </svg>
      </Link>
    </div>
  );
}
