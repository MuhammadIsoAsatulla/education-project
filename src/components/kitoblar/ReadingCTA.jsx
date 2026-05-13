import OrnamentDivider from '../common/OrnamentDivider.jsx';

export default function ReadingCTA({ book, progress, onOpen, onRestart }) {
  if (!book?.pdf) return null;

  const hasProgress = progress?.lastPage > 0;
  const percent = progress?.percent || 0;
  const lastPage = progress?.lastPage || 0;

  return (
    <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 max-w-3xl mx-auto reveal">
      <div
        className="relative p-6 sm:p-10 md:p-12 rounded-sm border border-gold/30 backdrop-blur overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${book.accent}1f, var(--bg-mid) 60%, ${book.accent}11)`,
        }}
      >
        <div className="absolute inset-0 bg-girih opacity-30 pointer-events-none" />
        <div
          className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${book.accent}22, transparent 70%)` }}
        />

        <div className="relative text-center">
          <OrnamentDivider className="opacity-60 mb-5" />
          <div className="eyebrow mb-3 text-xs">— TO'LIQ MUTOLAA —</div>
          <h3 className="font-serif text-cream text-3xl sm:text-4xl md:text-5xl mb-3 leading-tight">
            Kitobni Mutolaa Qilish
          </h3>

          {/* Book stats */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-cream-soft/80 text-sm mb-6 flex-wrap">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gold">
                <path d="M2 5 C7 5 10 6 12 8 C14 6 17 5 22 5 V19 C17 19 14 20 12 22 C10 20 7 19 2 19 Z" />
              </svg>
              {book.pages} sahifa
            </span>
            <span className="text-gold/40">·</span>
            <span>{book.language}</span>
          </div>

          {/* Progress indicator (only if user has started) */}
          {hasProgress && (
            <div className="max-w-md mx-auto mb-6">
              <div className="flex items-center justify-between text-xs text-cream-soft/70 mb-2">
                <span>O'qigan: <span className="text-gold">{lastPage}-sahifa</span></span>
                <span className="text-gold">{percent}%</span>
              </div>
              <div className="h-1.5 bg-bg-deep rounded-full overflow-hidden border border-gold/20">
                <div
                  className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright transition-all duration-700"
                  style={{ width: `${Math.max(2, percent)}%` }}
                />
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={onOpen} className="gold-cta">
              <span className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M2 5 C7 5 10 6 12 8 C14 6 17 5 22 5 V19 C17 19 14 20 12 22 C10 20 7 19 2 19 Z" />
                </svg>
                {hasProgress ? `Davom etish (${lastPage}-sahifa)` : 'Kitobni boshlash'}
              </span>
            </button>

            <a
              href={book.pdf}
              download
              className="inline-flex items-center gap-2 px-5 py-3 border border-gold/40 text-cream-soft text-xs tracking-[2px] uppercase hover:text-gold hover:border-gold rounded-sm transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              PDF yuklab olish
            </a>

            {hasProgress && (
              <button
                onClick={onRestart}
                className="text-cream-soft/50 hover:text-gold text-xs tracking-[2px] uppercase transition"
              >
                ⟲ Boshidan
              </button>
            )}
          </div>

          {book.pdfSource && (
            <p className="text-cream-soft/40 text-[10px] tracking-[2px] uppercase mt-6 italic">
              manba: {book.pdfSource}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
