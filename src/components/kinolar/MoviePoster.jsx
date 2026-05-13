import { Link } from 'react-router-dom';
import SmartImage from '../common/SmartImage.jsx';
import FavoriteButton from '../common/FavoriteButton.jsx';

export default function MoviePoster({ movie, index = 0, featured = false }) {
  return (
    <Link
      to={`/kinolar/${movie.slug}`}
      className={`group relative block reveal ${featured ? 'col-span-2 row-span-2' : ''}`}
      data-reveal-delay={index * 80}
    >
      <article className="relative aspect-[2/3] overflow-hidden rounded-sm border border-gold/20 group-hover:border-gold/80 transition-all duration-500">
        <SmartImage
          src={movie.poster}
          alt={movie.title}
          initial={movie.initial}
          accent={movie.accent}
          className="absolute inset-0"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />

        {/* Vintage cinema-style decorative frame */}
        <span className="absolute inset-0 border border-gold/15 m-2 pointer-events-none z-10" />

        {/* Film strip pattern on edges */}
        <div className="absolute top-0 bottom-0 left-0 w-2 bg-bg-deep flex flex-col justify-around py-2 z-10">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="block w-1 h-1.5 mx-auto bg-gold/40 rounded-full" />
          ))}
        </div>
        <div className="absolute top-0 bottom-0 right-0 w-2 bg-bg-deep flex flex-col justify-around py-2 z-10">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="block w-1 h-1.5 mx-auto bg-gold/40 rounded-full" />
          ))}
        </div>

        {/* Gradient overlay */}
        <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-deep via-bg-deep/80 to-transparent" />

        {/* Hover overlay with synopsis */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
          <div className="opacity-100 group-hover:opacity-0 transition-opacity duration-500">
            <div className="font-amiri text-gold text-[11px] tracking-[3px] uppercase mb-1">
              — {movie.year} · {movie.genre} —
            </div>
            <h3 className="font-serif text-cream text-xl md:text-2xl leading-tight">{movie.title}</h3>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-gradient-to-t from-bg-deep via-bg-deep/95 to-bg-deep/30">
            <div className="flex items-center gap-3 mb-3 text-xs">
              <span className="text-gold font-semibold">★ {movie.rating}</span>
              <span className="text-cream-soft/70">{movie.year}</span>
              <span className="text-cream-soft/70">{movie.duration}</span>
            </div>
            <h3 className="font-serif text-cream text-2xl mb-2">{movie.title}</h3>
            <p className="text-cream-soft/80 text-sm leading-snug line-clamp-3 mb-3">{movie.synopsis}</p>
            <span className="inline-flex items-center gap-2 text-gold text-xs tracking-[2px] uppercase">
              Ko'rish
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-3">
                <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
              </svg>
            </span>
          </div>
        </div>

        {/* Top corner rating badge */}
        <span className="absolute top-3 right-3 px-2 py-1 bg-bg-deep/80 border border-gold/30 rounded-sm text-gold text-[10px] tracking-[2px] uppercase backdrop-blur z-20">
          ★ {movie.rating}
        </span>

        {/* Favorite button top-left (so it doesn't collide with rating badge) */}
        <div className="absolute top-3 left-5 z-20">
          <FavoriteButton section="kinolar" itemId={movie.id} size="sm" />
        </div>
      </article>
    </Link>
  );
}
