import { Link } from 'react-router-dom';
import SmartImage from '../common/SmartImage.jsx';
import FavoriteButton from '../common/FavoriteButton.jsx';

export default function SongCard({ song, onOpen, index = 0 }) {
  const youtubeAvailable = !!(song.youtubeId || song.youtubeQuery);

  return (
    <div className="group relative text-left reveal w-full" data-reveal-delay={index * 80}>
      <button
        onClick={() => onOpen(song)}
        className="block w-full text-left"
        aria-label={`Karaoke: ${song.title}`}
      >
        <div className="relative aspect-square rounded-sm overflow-hidden border border-gold/20 group-hover:border-gold/80 transition-all duration-500 mb-4">
          <SmartImage src={song.image} alt={song.title} initial={song.initial} accent={song.accent} />

          {/* Hover overlay with play */}
          <div className="absolute inset-0 bg-bg-deep/0 group-hover:bg-bg-deep/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-16 h-16 rounded-full bg-gold text-bg-deep flex items-center justify-center group-hover:scale-110 transition">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {song.duration && song.duration !== '—' && (
            <span className="absolute bottom-3 left-3 px-2 py-1 bg-bg-deep/70 border border-gold/30 rounded-sm text-gold text-[10px] tracking-[2px] uppercase backdrop-blur">
              {song.duration}
            </span>
          )}
          {!youtubeAvailable && !song.audio && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-bg-deep/80 border border-gold/30 rounded-sm text-gold/80 text-[9px] tracking-[2px] uppercase backdrop-blur">
              Tez orada
            </span>
          )}

          {/* Favorite button top-right */}
          <div
            className="absolute top-3 right-3 z-20"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <FavoriteButton section="musiqa" itemId={song.id} size="sm" />
          </div>
        </div>

        <div>
          <h3 className="font-serif text-cream text-xl group-hover:text-gold transition-colors leading-tight mb-1">
            {song.title}
          </h3>
          <p className="text-cream-soft/70 text-sm">{song.artist}</p>
          <p className="text-gold/60 text-xs tracking-[2px] uppercase mt-1">— {song.genre} —</p>
        </div>
      </button>
      {/* Bordered pill — was a 10px low-contrast link, basically invisible
          against the cream song info next to it. Now framed in gold so it
          reads as a real button. */}
      <Link
        to={`/musiqa/${song.slug}`}
        className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 border border-gold/50 hover:border-gold hover:bg-gold/10 text-gold text-[11px] tracking-[2px] uppercase rounded-full transition"
      >
        <span>Batafsil</span>
        <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-2.5">
          <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
        </svg>
      </Link>
    </div>
  );
}
