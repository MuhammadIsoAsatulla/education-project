import { Link } from 'react-router-dom';
import SmartImage from '../common/SmartImage.jsx';

export default function AllomaCard({ alloma, index = 0 }) {
  return (
    <Link
      to={`/allomalar/${alloma.slug}`}
      className="group relative block reveal"
      data-reveal-delay={index * 100}
    >
      <article className="relative h-[520px] overflow-hidden border border-gold/20 hover:border-gold/80 rounded-sm transition-all duration-700 bg-bg-mid">
        {/* Image fills the card, anchored at top so faces stay visible */}
        <SmartImage
          src={alloma.image}
          alt={alloma.name}
          initial={alloma.initial}
          accent={alloma.accent}
          objectPosition={alloma.imagePosition || 'center top'}
          className="absolute inset-0"
          imgClassName="transition-transform duration-[1200ms] group-hover:scale-[1.03]"
        />

        {/* Top vignette (subtle, keeps facial detail readable) */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-bg-deep/40 to-transparent pointer-events-none" />

        {/* Bottom gradient — covers only the lower 55% so the face stays clear */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-bg-deep via-bg-deep/85 to-transparent pointer-events-none" />

        {/* Gold corner accents */}
        <span className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold opacity-70 group-hover:opacity-100 transition-opacity z-10" />
        <span className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold opacity-70 group-hover:opacity-100 transition-opacity z-10" />
        <span className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold opacity-70 group-hover:opacity-100 transition-opacity z-10" />
        <span className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold opacity-70 group-hover:opacity-100 transition-opacity z-10" />

        {/* Era badge in the top-left, above the face */}
        <div className="absolute top-5 left-5 z-10 px-3 py-1 bg-bg-deep/70 backdrop-blur border border-gold/40 rounded-sm">
          <span className="font-amiri text-gold text-[10px] tracking-[3px] uppercase">{alloma.era}</span>
        </div>

        {/* Text block at the bottom — never overlaps the upper portrait */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-7">
          <h3 className="font-serif text-3xl md:text-4xl text-cream font-semibold leading-tight mb-1 group-hover:text-gold-gradient transition-colors duration-500">
            {alloma.name}
          </h3>
          <p className="font-amiri text-gold/90 text-[11px] tracking-[3px] uppercase mb-3">
            {alloma.field}
          </p>

          <p className="font-serif italic text-cream-soft/90 text-sm leading-snug mb-4 line-clamp-2">
            “{alloma.quote}”
          </p>

          <div className="flex items-end justify-between">
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
