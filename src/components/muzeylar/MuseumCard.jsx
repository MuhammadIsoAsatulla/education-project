import { Link } from 'react-router-dom';
import SmartImage from '../common/SmartImage.jsx';

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
        className="relative h-[420px] overflow-hidden rounded-sm border border-gold/20 group-hover:border-gold/80 transition-all duration-700"
      >
        <SmartImage
          src={muzey.image}
          alt={muzey.name}
          initial={muzey.initial}
          accent={muzey.accent}
          className="absolute inset-0"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/60 to-transparent" />

        <div className="relative z-10 p-7 h-full flex flex-col justify-end">
          <div className="flex items-center justify-between mb-3">
            <span className="font-amiri text-gold text-xs tracking-[3px] uppercase">
              — {muzey.city} —
            </span>
            {!isAvailable && (
              <span className="px-3 py-1 bg-bg-deep/60 border border-gold/40 text-gold/80 text-[10px] tracking-[2px] uppercase rounded-full backdrop-blur">
                Tez orada
              </span>
            )}
          </div>
          <h3 className="font-serif text-cream text-3xl md:text-4xl font-semibold leading-tight mb-2 group-hover:text-gold-gradient transition-colors duration-500">
            {muzey.name}
          </h3>
          <p className="font-amiri text-gold/80 text-xs tracking-[3px] uppercase mb-3">
            {muzey.century}
          </p>
          <p className="text-cream-soft/85 text-sm leading-relaxed line-clamp-2 mb-4">
            {muzey.shortDescription}
          </p>

          {isAvailable && (
            <div className="inline-flex items-center gap-3 text-gold text-xs tracking-[2px] uppercase font-semibold group-hover:gap-5 transition-[gap]">
              360° Sayohat
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-3">
                <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
              </svg>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
