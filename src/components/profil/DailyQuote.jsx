import { useMemo } from 'react';
import quotes from '../../data/dailyQuotes.json';
import useProgress from '../../hooks/useProgress.js';

function dayIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  return Math.floor(diff / 86400000);
}

export default function DailyQuote() {
  const { state, markQuoteSeen } = useProgress();
  const quote = useMemo(() => quotes[dayIndex() % quotes.length], []);
  const seen = state.dailyContent?.quotesSeen?.includes(quote.id);

  return (
    <div className="relative p-6 sm:p-8 border border-gold/25 rounded-sm bg-bg-mid/40 backdrop-blur overflow-hidden">
      {/* Decorative quote mark */}
      <div
        className="absolute top-0 right-4 text-8xl sm:text-9xl text-gold/15 font-serif leading-none pointer-events-none select-none"
        aria-hidden
      >
        “
      </div>
      <div className="relative">
        <div className="eyebrow text-[10px] mb-3">— BUGUNGI HIKMAT —</div>
        <blockquote className="font-serif italic text-cream text-lg sm:text-xl leading-relaxed mb-4">
          {quote.text}
        </blockquote>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-gold/80 font-amiri tracking-[2px] text-sm">— {quote.author}</p>
          {seen ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-gold/70">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M5 13l4 4L19 7" />
              </svg>
              O'qildi
            </span>
          ) : (
            <button
              onClick={() => markQuoteSeen(quote.id)}
              className="px-3 py-1.5 border border-gold/40 text-cream-soft hover:text-gold hover:border-gold rounded-full text-[10px] tracking-[2px] uppercase transition"
            >
              O'qildi (+5 ball)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
