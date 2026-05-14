import { useState } from 'react';
import HeroCard from './HeroCard.jsx';

export default function PackReveal({ hero, onAccept }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {!revealed ? (
        <>
          <div className="relative">
            <div
              className="w-40 h-56 rounded-xl border-2 border-gold/40 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
              style={{ background: 'linear-gradient(135deg, #0d2b3e 0%, #1a3a5c 50%, #0f4c5c 100%)' }}
              onClick={() => setRevealed(true)}
            >
              <div className="text-center">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-16 h-16 text-gold/60 mb-2">
                  <path d="M32 8 L56 20 L56 44 L32 56 L8 44 L8 20 Z" />
                  <path d="M32 8 L32 32 M8 20 L32 32 M56 20 L32 32" opacity="0.5" />
                  <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.6" />
                </svg>
                <p className="text-gold/70 text-xs tracking-widest uppercase">Ochish</p>
              </div>
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(212,165,116,0.15) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s linear infinite',
                }}
              />
            </div>
          </div>
          <p className="text-cream/50 text-sm">Kartochkani ochish uchun bosing</p>
        </>
      ) : (
        <>
          <div className="animate-fade-in-up w-44">
            <HeroCard hero={hero} owned={false} />
          </div>
          <div className="text-center">
            <p className="text-cream text-lg font-semibold">{hero.name}</p>
            <p className="text-cream/50 text-sm">{hero.title}</p>
          </div>
          <button
            onClick={onAccept}
            className="px-8 py-3 bg-gold text-bg-deep font-semibold rounded-lg hover:bg-gold/90 transition-colors"
          >
            Qabul qilish
          </button>
        </>
      )}
    </div>
  );
}
