import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import PdfPage from './PdfPage.jsx';
import { loadPdf } from '../../utils/pdf.js';
import useProgress from '../../hooks/useProgress.js';

// Logical page dimensions for HTMLFlipBook. The actual displayed size stretches
// to fit the parent (see size="stretch"), but the aspect ratio is preserved.
// A4 portrait ratio ~ 1:1.414 → 600 × 848.
const PAGE_WIDTH = 600;
const PAGE_HEIGHT = 848;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 452;
const MAX_WIDTH = 720;
const MAX_HEIGHT = 1018;
const MOBILE_BREAKPOINT = 768;

export default function BookReader({ book, initialPage = 1, onClose }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [visiblePages, setVisiblePages] = useState(() => new Set([1, 2, 3, 4]));
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const flipRef = useRef(null);
  const { setReadingProgress } = useProgress();

  // Track viewport for single/double page mode
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Load PDF document
  useEffect(() => {
    let cancelled = false;
    setError(null);
    loadPdf(book.pdf)
      .then((doc) => {
        if (cancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message || 'PDF yuklanmadi');
      });
    return () => {
      cancelled = true;
    };
  }, [book.pdf]);

  // Lock body scroll while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ESC closes the reader
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowLeft') flipRef.current?.pageFlip()?.flipPrev();
      if (e.key === 'ArrowRight') flipRef.current?.pageFlip()?.flipNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Persist last page periodically
  const persist = useCallback(
    (page) => {
      if (!totalPages) return;
      setReadingProgress(book.slug, page, totalPages);
    },
    [book.slug, totalPages, setReadingProgress],
  );

  // Jump to the initial page once PDF is loaded
  const didInitialJump = useRef(false);
  useEffect(() => {
    if (didInitialJump.current) return;
    if (!pdfDoc || initialPage <= 1) return;
    const flip = flipRef.current?.pageFlip();
    if (!flip) return;
    // react-pageflip uses 0-based indexes
    const idx = Math.min(initialPage - 1, totalPages - 1);
    flip.flip(idx, 'top');
    didInitialJump.current = true;
  }, [pdfDoc, initialPage, totalPages]);

  // Update visible pages whenever current page changes (preload ±2)
  useEffect(() => {
    const wanted = new Set();
    for (let p = Math.max(1, currentPage - 2); p <= Math.min(totalPages, currentPage + 4); p++) {
      wanted.add(p);
    }
    setVisiblePages(wanted);
  }, [currentPage, totalPages]);

  const onFlip = useCallback(
    (e) => {
      // e.data is the page index (0-based) of the left page of the new spread
      const page = (e.data || 0) + 1;
      setCurrentPage(page);
      persist(page);
    },
    [persist],
  );

  const goPrev = () => flipRef.current?.pageFlip()?.flipPrev();
  const goNext = () => flipRef.current?.pageFlip()?.flipNext();

  const percent = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[90] bg-bg-deep/98 backdrop-blur-xl flex flex-col" role="dialog" aria-modal="true">
      {/* Decorative pattern + spotlight */}
      <div className="absolute inset-0 bg-girih opacity-30 pointer-events-none" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${book.accent}22, transparent 60%)` }}
      />

      {/* Toolbar */}
      <header className="relative z-10 px-4 sm:px-6 md:px-12 py-3 sm:py-4 flex items-center justify-between gap-3 border-b border-gold/15 bg-bg-deep/60 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:block w-10 h-10 rounded-sm overflow-hidden border border-gold/40 flex-shrink-0">
            <div
              className="w-full h-full flex items-center justify-center font-serif text-gold text-lg"
              style={{ background: `linear-gradient(135deg, ${book.accent}88, var(--teal))` }}
            >
              {book.initial}
            </div>
          </div>
          <div className="min-w-0">
            <div className="eyebrow text-[10px] mb-0.5">— MUTOLAA —</div>
            <h2 className="font-serif text-cream text-base sm:text-xl leading-tight truncate">{book.title}</h2>
            <p className="text-cream-soft/70 text-[11px] sm:text-xs truncate">
              {book.author}
              {totalPages > 0 && ` · sahifa ${currentPage} / ${totalPages}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={book.pdf}
            download
            className="hidden sm:inline-flex w-10 h-10 rounded-full border border-gold/40 text-gold/80 hover:text-gold hover:border-gold items-center justify-center transition"
            title="PDF'ni yuklab olish"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </a>
          <button
            onClick={onClose}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-bg-deep transition flex items-center justify-center"
            aria-label="Yopish"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M6 6 L18 18 M18 6 L6 18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Reader content */}
      <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden px-2 sm:px-6 py-4 sm:py-8">
        {error && (
          <div className="text-center max-w-md">
            <div className="font-serif text-cream text-2xl mb-3">PDF yuklanmadi</div>
            <p className="text-cream-soft/70 text-sm mb-6">{error}</p>
            <a href={book.pdf} download className="gold-cta">
              <span>To'g'ridan-to'g'ri yuklab olish</span>
            </a>
          </div>
        )}

        {!error && !pdfDoc && (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className="text-cream-soft/70 text-sm tracking-[2px] uppercase">Kitob yuklanmoqda…</p>
          </div>
        )}

        {!error && pdfDoc && (
          <div className="relative max-w-full max-h-full">
            {/* Book ornate frame backdrop */}
            <div
              className="absolute -inset-2 sm:-inset-4 rounded-sm pointer-events-none"
              style={{
                background: `linear-gradient(135deg, #e8c898, ${book.accent || '#d4a574'} 50%, #b8893f)`,
                opacity: 0.4,
                filter: 'blur(20px)',
              }}
            />

            <HTMLFlipBook
              ref={flipRef}
              width={PAGE_WIDTH}
              height={PAGE_HEIGHT}
              size="stretch"
              minWidth={MIN_WIDTH}
              maxWidth={MAX_WIDTH}
              minHeight={MIN_HEIGHT}
              maxHeight={MAX_HEIGHT}
              showCover={false}
              flippingTime={700}
              usePortrait={isMobile}
              mobileScrollSupport={false}
              drawShadow
              maxShadowOpacity={0.5}
              className="meros-flip-book"
              onFlip={onFlip}
              style={{ position: 'relative', zIndex: 1 }}
            >
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <PdfPage
                    key={pageNum}
                    pdfDoc={pdfDoc}
                    pageNum={pageNum}
                    totalPages={totalPages}
                    visible={visiblePages.has(pageNum)}
                    accent={book.accent}
                  />
                );
              })}
            </HTMLFlipBook>
          </div>
        )}
      </div>

      {/* Footer controls */}
      {!error && pdfDoc && (
        <footer className="relative z-10 px-4 sm:px-6 md:px-12 py-3 sm:py-4 border-t border-gold/15 bg-bg-deep/60 backdrop-blur">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3">
              <button
                onClick={goPrev}
                disabled={currentPage <= 1}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gold/40 text-gold/80 hover:text-gold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center"
                aria-label="Oldingi sahifa"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div className="text-center min-w-[80px]">
                <div className="font-serif text-gold text-base sm:text-lg tabular-nums">
                  {currentPage}<span className="text-gold/50 mx-1">/</span>{totalPages}
                </div>
                <div className="text-cream-soft/50 text-[10px] tracking-[2px] uppercase">{percent}%</div>
              </div>

              <button
                onClick={goNext}
                disabled={currentPage >= totalPages}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gold/40 text-gold/80 hover:text-gold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center"
                aria-label="Keyingi sahifa"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            <div className="h-1 bg-bg-deep rounded-full overflow-hidden border border-gold/20">
              <div
                className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </footer>
      )}

      <style>{`
        .meros-flip-book .page {
          background: #f5ebd6;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        .meros-flip-book .page-wrapper {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
