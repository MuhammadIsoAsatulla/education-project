import { useMemo, useState } from 'react';
import words from '../../data/dailyWords.json';
import useProgress from '../../hooks/useProgress.js';

function dayIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  return Math.floor(diff / 86400000);
}

export default function DailyWord() {
  const { state, markWord } = useProgress();
  // Use a different rotation than quotes
  const word = useMemo(() => words[(dayIndex() * 7) % words.length], []);
  const known = state.dailyContent?.wordsKnown?.includes(word.id);
  const unknown = state.dailyContent?.wordsUnknown?.includes(word.id);
  const [revealed, setRevealed] = useState(known || unknown);

  return (
    <div className="relative p-6 sm:p-7 border border-gold/25 rounded-sm bg-bg-mid/40 backdrop-blur overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 bg-girih opacity-15 pointer-events-none" />

      <div className="relative">
        <div className="eyebrow text-[10px] mb-3">— BUGUNGI SO'Z —</div>
        <h3
          className="font-serif text-gold-gradient text-2xl sm:text-3xl md:text-4xl mb-3 tracking-wide"
          style={{ fontFamily: 'var(--font-amiri, "Amiri", serif)' }}
        >
          {word.word}
        </h3>

        {!revealed ? (
          <div>
            <p className="text-cream-soft/60 italic mb-4">
              Bu so'zning ma'nosini bilasizmi?
            </p>
            <button
              onClick={() => setRevealed(true)}
              className="px-4 py-2 border border-gold/40 text-cream-soft hover:text-gold hover:border-gold rounded-full text-xs tracking-[2px] uppercase transition"
            >
              Ma'nosini ko'rsatish
            </button>
          </div>
        ) : (
          <>
            <p className="text-cream font-serif text-lg mb-2">{word.meaning}</p>
            {word.example && (
              <p className="text-cream-soft/60 text-sm italic mb-4 border-l-2 border-gold/30 pl-3">
                «{word.example}»
              </p>
            )}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => markWord(word.id, true)}
                className={`px-3 py-1.5 rounded-full text-[10px] tracking-[2px] uppercase transition ${
                  known
                    ? 'bg-gold/20 border border-gold/60 text-gold'
                    : 'border border-gold/30 text-cream-soft/70 hover:text-gold hover:border-gold/60'
                }`}
              >
                Bilaman
              </button>
              <button
                onClick={() => markWord(word.id, false)}
                className={`px-3 py-1.5 rounded-full text-[10px] tracking-[2px] uppercase transition ${
                  unknown
                    ? 'bg-cream-soft/10 border border-cream-soft/50 text-cream-soft'
                    : 'border border-gold/30 text-cream-soft/70 hover:border-gold/60'
                }`}
              >
                Bilmasdim
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
