import { Link } from 'react-router-dom';
import allomalar from '../../data/allomalar.json';
import SmartImage from '../common/SmartImage.jsx';

function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

export default function DailyFigure() {
  const figure = allomalar[dayOfYear() % allomalar.length];

  return (
    <section
      className="relative px-6 md:px-12 py-32 overflow-hidden border-y border-gold/20"
      style={{ background: 'linear-gradient(135deg, var(--bg-deep) 0%, var(--teal) 100%)' }}
    >
      <div className="absolute inset-0 bg-girih opacity-100 pointer-events-none" />
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-16 items-center">
        {/* Portrait card */}
        <div className="reveal aspect-[3/4] relative overflow-hidden border border-gold rounded-sm shadow-2xl">
          <SmartImage
            src={figure.image}
            alt={figure.name}
            initial={figure.initial}
            accent={figure.accent}
            objectPosition={figure.imagePosition || 'center top'}
          />
          <div className="absolute inset-3 border border-gold/40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-deep via-bg-deep/70 to-transparent">
            <p className="eyebrow text-xs">— BUGUNGI ALLOMA —</p>
          </div>
        </div>

        {/* Text */}
        <div className="reveal" data-reveal-delay="120">
          <div className="eyebrow mb-3">— BUGUNGI ALLOMA —</div>
          <h2 className="font-serif text-cream tracking-wide leading-tight mb-2"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>
            {figure.name}
          </h2>
          <p className="font-amiri text-gold text-lg tracking-[3px] mb-8">— {figure.years} —</p>

          <blockquote className="font-serif italic text-cream text-2xl md:text-3xl leading-snug border-l-2 border-gold pl-6 mb-8">
            “{figure.quote}”
          </blockquote>
          <p className="text-cream-soft text-base leading-relaxed mb-8 opacity-90">
            {figure.shortBio}
          </p>

          <Link to={`/allomalar/${figure.slug}`} className="gold-cta">
            <span>Batafsil Tanishish</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
