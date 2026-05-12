import SmartImage from '../common/SmartImage.jsx';

export default function SongCard({ song, onOpen, index = 0 }) {
  const youtubeAvailable = !!(song.youtubeId || song.youtubeQuery);

  return (
    <button
      onClick={() => onOpen(song)}
      className="group relative text-left reveal w-full"
      data-reveal-delay={index * 80}
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
          <span className="absolute top-3 right-3 px-2 py-1 bg-bg-deep/80 border border-gold/30 rounded-sm text-gold/80 text-[9px] tracking-[2px] uppercase backdrop-blur">
            Tez orada
          </span>
        )}
      </div>

      <div>
        <h3 className="font-serif text-cream text-xl group-hover:text-gold transition-colors leading-tight mb-1">
          {song.title}
        </h3>
        <p className="text-cream-soft/70 text-sm">{song.artist}</p>
        <p className="text-gold/60 text-xs tracking-[2px] uppercase mt-1">— {song.genre} —</p>
      </div>
    </button>
  );
}
