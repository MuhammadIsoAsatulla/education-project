import { Link } from 'react-router-dom';
import SmartImage from '../common/SmartImage.jsx';
import FavoriteButton from '../common/FavoriteButton.jsx';

export default function BookSpine({ book, index = 0, height = 380 }) {
  // Vary spine width slightly so the shelf feels organic
  const w = 70 + ((book.title.length * 7) % 30);
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
        {/* Decorative top/bottom bands */}
        <span className="absolute top-2 inset-x-2 h-px bg-gold/40" />
        <span className="absolute top-4 inset-x-2 h-px bg-gold/30" />
        <span className="absolute bottom-2 inset-x-2 h-px bg-gold/40" />
        <span className="absolute bottom-4 inset-x-2 h-px bg-gold/30" />

        {/* Initial at top */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 font-serif text-2xl text-gold/90 font-medium">
          {book.initial}
        </div>

        {/* Vertical title */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-cream tracking-wide"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontSize: '14px' }}
        >
          {book.title.toUpperCase()}
        </div>

        {/* Author at bottom */}
        <div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-amiri text-gold/80 text-[10px] tracking-[2px] uppercase"
          style={{ writingMode: 'vertical-rl' }}
        >
          {book.author}
        </div>

        {/* Favorite — small heart at top of spine */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10">
          <FavoriteButton section="kitoblar" itemId={book.id} size="sm" />
        </div>
      </article>
    </Link>
  );
}
