import { Link } from 'react-router-dom';
import SmartImage from '../common/SmartImage.jsx';

export default function AllomaCard({ alloma, index = 0 }) {
  return (
    <Link
      to={`/allomalar/${alloma.slug}`}
      className="group relative block reveal"
      data-reveal-delay={index * 100}
    >
      <article
        className="relative h-[480px] overflow-hidden border border-gold/20 hover:border-gold/80 rounded-sm transition-all duration-700"
      >
        {/* Image */}
        <SmartImage
          src={alloma.image}
          alt={alloma.name}
          initial={alloma.initial}
          accent={alloma.accent}
          className="absolute inset-0"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gold corner accents */}
        <span className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold opacity-60 group-hover:opacity-100 transition-opacity z-10" />
        <span className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold opacity-60 group-hover:opacity-100 transition-opacity z-10" />
        <span className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold opacity-60 group-hover:opacity-100 transition-opacity z-10" />
        <span className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold opacity-60 group-hover:opacity-100 transition-opacity z-10" />

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-deep via-bg-deep/85 to-transparent" />

        <div className="relative z-10 p-7 h-full flex flex-col justify-end">
          <div className="font-serif text-gold tracking-[4px] text-xs mb-2 opacity-80">
            — {alloma.era} —
          </div>
          <h3 className="font-serif text-3xl md:text-4xl text-cream font-semibold leading-tight mb-2 group-hover:text-gold-gradient transition-colors duration-500">
            {alloma.name}
          </h3>
          <p className="font-amiri text-gold text-xs tracking-[3px] uppercase mb-3">{alloma.field}</p>
          <p className="font-serif italic text-cream-soft/90 text-sm leading-snug max-w-md mb-4 line-clamp-2">
            “{alloma.quote}”
          </p>

          <div className="mt-2 flex items-end justify-between">
            <div className="font-amiri text-gold/80 text-sm tracking-[2px]">{alloma.years}</div>
            <div className="inline-flex items-center gap-3 text-gold text-xs tracking-[2px] uppercase font-semibold group-hover:gap-5 transition-[gap] duration-300">
              Tanish
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-3">
                <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
