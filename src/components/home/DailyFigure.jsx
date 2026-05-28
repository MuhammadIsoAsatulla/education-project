import { Link } from 'react-router-dom';
import allomalar from '../../data/allomalar.json';
import SmartImage from '../common/SmartImage.jsx';

function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

const CORNER_POS = ['top-[6px] left-[6px]', 'top-[6px] right-[6px]', 'bottom-[6px] left-[6px]', 'bottom-[6px] right-[6px]'];

export default function DailyFigure() {
  const figure = allomalar[dayOfYear() % allomalar.length];

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--bg-deep) 0%, var(--teal) 100%)' }}
    >
      {/* Girih texture */}
      <div className="absolute inset-0 bg-girih opacity-50 pointer-events-none" />

      {/* Ambient glow — portrait side */}
      <div className="absolute pointer-events-none" style={{
        left: '-8%', top: '20%', width: '520px', height: '520px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,165,116,0.1) 0%, transparent 70%)',
      }} />
      {/* Ambient glow — text side */}
      <div className="absolute pointer-events-none" style={{
        right: '-5%', top: '40%', width: '380px', height: '380px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,165,116,0.06) 0%, transparent 70%)',
      }} />

      {/* Ornamental heading */}
      <div className="relative z-10 pt-20 pb-14 text-center px-4">
        <div className="flex items-center gap-5 justify-center">
          <div style={{ flex: 1, maxWidth: '200px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.5))' }} />
          <span style={{ fontFamily: 'var(--font-amiri)', color: '#d4a574', letterSpacing: '6px', fontSize: '13px', textTransform: 'uppercase' }}>
            ✦ Bugungi Alloma ✦
          </span>
          <div style={{ flex: 1, maxWidth: '200px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(212,165,116,0.5))' }} />
        </div>
      </div>

      {/* Main grid */}
      <div className="relative z-10 max-w-[1200px] mx-auto pb-24 px-6 md:px-12 grid lg:grid-cols-[1fr_1.5fr] gap-16 items-center">

        {/* Portrait card */}
        <div className="reveal aspect-[3/4] relative overflow-hidden" style={{
          border: '1px solid rgba(212,165,116,0.45)',
          boxShadow: '0 0 60px rgba(212,165,116,0.1), 0 30px 70px rgba(0,0,0,0.7)',
        }}>
          <SmartImage src={figure.image} alt={figure.name} initial={figure.initial} accent={figure.accent} />
          {/* Inner frame */}
          <div className="absolute inset-[10px] pointer-events-none" style={{ border: '1px solid rgba(212,165,116,0.22)' }} />
          {/* Corner ornaments */}
          {CORNER_POS.map((pos, i) => (
            <span key={i} className={`absolute ${pos} leading-none`} style={{ color: '#d4a574', fontSize: '10px' }}>✦</span>
          ))}
          {/* Year label at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-center" style={{
            background: 'linear-gradient(to top, rgba(10,6,2,0.97) 0%, rgba(10,6,2,0.65) 55%, transparent)',
          }}>
            <p style={{ fontFamily: 'var(--font-amiri)', color: '#d4a574', letterSpacing: '4px', fontSize: '12px' }}>
              — {figure.years} —
            </p>
          </div>
        </div>

        {/* Text */}
        <div className="reveal" data-reveal-delay="120">
          <p style={{ fontFamily: 'var(--font-amiri)', color: 'rgba(212,165,116,0.7)', letterSpacing: '3px', fontSize: '13px', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
            {figure.field}
          </p>
          <h2
            className="font-serif text-cream leading-tight mb-7"
            style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            {figure.name}
          </h2>

          <div className="hairline mb-8" />

          <blockquote
            className="font-serif italic text-cream border-l-2 border-gold pl-6 mb-7"
            style={{ fontSize: 'clamp(17px, 2vw, 24px)', lineHeight: 1.75 }}
          >
            "{figure.quote}"
          </blockquote>

          <p style={{ color: 'rgba(235,224,200,0.78)', fontSize: '15px', lineHeight: 1.9, marginBottom: '2.5rem' }}>
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
