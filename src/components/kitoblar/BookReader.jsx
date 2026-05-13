import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import PdfPage from './PdfPage.jsx';
import SmartImage from '../common/SmartImage.jsx';
import { loadPdf } from '../../utils/pdf.js';
import useProgress from '../../hooks/useProgress.js';

// Logical page dimensions for HTMLFlipBook. The actual displayed size stretches
// to fit the parent (see size="stretch"), respecting the aspect ratio.
// A4 portrait ratio ~ 1:1.414.
// Aspect ratio of each page (A4 portrait).
const PAGE_RATIO = 1.414;
const MOBILE_BREAKPOINT = 768;
const JUMP_STEP = 10;

export default function BookReader({ book, initialPage = 1, onClose }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [visiblePages, setVisiblePages] = useState(() => new Set([1, 2, 3, 4]));
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [editingPage, setEditingPage] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [readingMode, setReadingMode] = useState(false);
  const [bookSize, setBookSize] = useState({ width: 600, height: 848 });
  const flipRef = useRef(null);
  const { setReadingProgress } = useProgress();

  // Compute exact book dimensions to fit the gap between top & bottom bars.
  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const mobile = vw < MOBILE_BREAKPOINT;
      // Reserved chrome (toolbar + progress + footer) + breathing padding.
      const chrome = readingMode ? 24 : 170;
      const side = readingMode ? 16 : 80;
      const availH = Math.max(300, vh - chrome);
      const availW = Math.max(300, vw - side);
      let pageH;
      let pageW;
      if (mobile) {
        // Single page, fit to height first.
        pageH = availH;
        pageW = pageH / PAGE_RATIO;
        if (pageW > availW) {
          pageW = availW;
          pageH = pageW * PAGE_RATIO;
        }
      } else {
        // Two-page spread.
        pageH = availH;
        pageW = pageH / PAGE_RATIO;
        if (pageW * 2 > availW) {
          pageW = availW / 2;
          pageH = pageW * PAGE_RATIO;
        }
      }
      setBookSize({ width: Math.floor(pageW), height: Math.floor(pageH) });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [readingMode]);

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

  // Jump helpers
  const jumpToPage = useCallback(
    (page) => {
      const fp = flipRef.current?.pageFlip();
      if (!fp || !totalPages) return;
      const clamped = Math.max(1, Math.min(totalPages, page));
      const pageIndex = clamped - 1;
      // In two-page spread mode, page indices need to be aligned to the LEFT page
      // of the spread (even indices); otherwise react-pageflip's flip() lands
      // on the wrong spread and acts like a single-page step. turnToPage()
      // navigates instantly to the requested index.
      const targetIndex = isMobile ? pageIndex : pageIndex - (pageIndex % 2);
      try {
        fp.turnToPage(targetIndex);
      } catch {
        try {
          fp.flip(targetIndex, 'top');
        } catch {
          /* ignore */
        }
      }
    },
    [totalPages, isMobile],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      // Don't hijack keys when user is typing in the page input
      if (editingPage) return;
      if (e.key === 'Escape') {
        if (readingMode) return setReadingMode(false);
        return onClose?.();
      }
      if (e.key === 'ArrowLeft') return flipRef.current?.pageFlip()?.flipPrev();
      if (e.key === 'ArrowRight') return flipRef.current?.pageFlip()?.flipNext();
      if (e.key === 'PageUp') return jumpToPage(currentPage - JUMP_STEP);
      if (e.key === 'PageDown') return jumpToPage(currentPage + JUMP_STEP);
      if (e.key === 'Home') return jumpToPage(1);
      if (e.key === 'End') return jumpToPage(totalPages);
      if (e.key === 'f' || e.key === 'F') return setReadingMode((m) => !m);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, jumpToPage, currentPage, totalPages, editingPage, readingMode]);

  // Persist last page
  const persist = useCallback(
    (page) => {
      if (!totalPages) return;
      setReadingProgress(book.slug, page, totalPages);
    },
    [book.slug, totalPages, setReadingProgress],
  );

  // Jump to the initial page once PDF is loaded (reuses jumpToPage logic)
  const didInitialJump = useRef(false);
  useEffect(() => {
    if (didInitialJump.current) return;
    if (!pdfDoc || initialPage <= 1) return;
    jumpToPage(initialPage);
    didInitialJump.current = true;
  }, [pdfDoc, initialPage, totalPages, jumpToPage]);

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
      const page = (e.data || 0) + 1;
      setCurrentPage(page);
      persist(page);
    },
    [persist],
  );

  const submitPageInput = () => {
    const n = parseInt(pageInput, 10);
    if (Number.isFinite(n)) jumpToPage(n);
    setEditingPage(false);
    setPageInput('');
  };

  const percent = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-[200] bg-bg-deep/98 backdrop-blur-xl flex flex-col"
      role="dialog"
      aria-modal="true"
    >
      {/* Decorative pattern + spotlight */}
      <div className="absolute inset-0 bg-girih opacity-30 pointer-events-none" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${book.accent}22, transparent 60%)` }}
      />

      {/* Floating reader-mode exit button (only visible when in reading mode) */}
      {readingMode && (
        <button
          onClick={() => setReadingMode(false)}
          className="fixed top-4 right-4 z-[210] w-11 h-11 rounded-full border border-gold/40 text-gold/80 bg-bg-deep/70 backdrop-blur hover:text-gold hover:border-gold hover:bg-bg-deep/90 transition flex items-center justify-center"
          aria-label="Kitobxonlik rejimidan chiqish"
          title="Kitobxonlik rejimidan chiqish (F yoki Esc)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M10 4H4v6" />
            <path d="M4 4l6 6" />
            <path d="M14 4h6v6" />
            <path d="M20 4l-6 6" />
            <path d="M10 20H4v-6" />
            <path d="M4 20l6-6" />
            <path d="M14 20h6v-6" />
            <path d="M20 20l-6-6" />
          </svg>
        </button>
      )}

      {/* Toolbar — compact, hidden in reading mode */}
      {!readingMode && (
      <header className="relative z-10 px-4 sm:px-6 md:px-10 py-2 sm:py-2.5 flex items-center justify-between gap-3 bg-bg-deep/85 backdrop-blur flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:block w-11 h-14 rounded-sm overflow-hidden border border-gold/40 flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            <SmartImage
              src={book.cover}
              alt={book.title}
              initial={book.initial}
              accent={book.accent}
              objectPosition="center top"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-cream text-base sm:text-lg leading-tight truncate">
              {book.title}
            </h2>
            <p className="text-cream-soft/70 text-[10px] sm:text-[11px] tracking-[1px] truncate">
              {book.author}
              {totalPages > 0 && ` · ${currentPage} / ${totalPages} · ${percent}%`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setReadingMode(true)}
            className="hidden sm:inline-flex w-10 h-10 rounded-full border border-gold/40 text-gold/80 hover:text-gold hover:border-gold items-center justify-center transition"
            title="Kitobxonlik rejimi (F)"
            aria-label="Kitobxonlik rejimi"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          </button>
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
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-bg-deep transition flex items-center justify-center"
            aria-label="Yopish"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 sm:w-5 sm:h-5">
              <path d="M6 6 L18 18 M18 6 L6 18" />
            </svg>
          </button>
        </div>
      </header>
      )}

      {/* Progress bar — now under the toolbar (click to jump) */}
      {!error && pdfDoc && !readingMode && (
        <button
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            jumpToPage(Math.round(ratio * totalPages));
          }}
          className="relative z-10 block w-full h-1.5 bg-bg-deep border-b border-gold/15 overflow-hidden group cursor-pointer hover:h-2 transition-[height] duration-200 flex-shrink-0"
          aria-label="Progress bar — bosib sahifaga o'tish"
          title="Foizga bosib istalgan sahifaga o'tish"
        >
          <div
            className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright transition-all duration-500 group-hover:shadow-[0_0_12px_rgba(212,165,116,0.8)]"
            style={{ width: `${percent}%` }}
          />
        </button>
      )}

      {/* Reader content */}
      <div
        className={`relative z-10 flex-1 flex items-center justify-center overflow-hidden ${
          readingMode ? 'px-2 sm:px-4 py-3' : 'px-4 sm:px-8 md:px-12 py-6 sm:py-10'
        }`}
      >
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
          // The flipbook needs a parent with an explicit width/height to stretch into.
          // `w-full h-full` gives it the full available space; flex centers it.
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Glow halo behind the book — sized to the book via CSS pseudo */}
            <div
              className="absolute pointer-events-none rounded-sm"
              style={{
                inset: '-2%',
                background: `linear-gradient(135deg, #e8c898, ${book.accent || '#d4a574'} 50%, #b8893f)`,
                opacity: 0.25,
                filter: 'blur(40px)',
              }}
            />
            <HTMLFlipBook
              ref={flipRef}
              key={`${bookSize.width}x${bookSize.height}`}
              width={bookSize.width}
              height={bookSize.height}
              size="fixed"
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

      {/* Footer controls — hidden in reading mode */}
      {!error && pdfDoc && !readingMode && (
        <footer className="relative z-10 px-3 sm:px-6 md:px-12 py-2 sm:py-2.5 border-t border-gold/15 bg-bg-deep/85 backdrop-blur flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-1 sm:gap-3">
            <NavButton onClick={() => jumpToPage(1)} disabled={currentPage <= 1} label="Birinchi sahifa">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path d="M19 18l-7-6 7-6M12 18l-7-6 7-6" />
              </svg>
            </NavButton>

            <NavButton
              onClick={() => jumpToPage(currentPage - JUMP_STEP)}
              disabled={currentPage <= 1}
              label="-10 sahifa"
              badge="-10"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </NavButton>

            <NavButton
              onClick={() => flipRef.current?.pageFlip()?.flipPrev()}
              disabled={currentPage <= 1}
              label="Oldingi sahifa"
              primary
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </NavButton>

            {/* Page indicator (clickable to edit) */}
            <div className="text-center min-w-[100px] sm:min-w-[130px] px-2">
              {editingPage ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitPageInput();
                  }}
                  className="flex items-center justify-center gap-1"
                >
                  <input
                    autoFocus
                    type="number"
                    min="1"
                    max={totalPages}
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onBlur={submitPageInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setEditingPage(false);
                        setPageInput('');
                      }
                    }}
                    placeholder={String(currentPage)}
                    className="w-16 sm:w-20 bg-bg-deep border border-gold/60 text-cream text-center font-serif text-base sm:text-lg rounded-sm py-0.5 outline-none focus:border-gold"
                  />
                  <span className="text-gold/60 text-sm">/ {totalPages}</span>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setPageInput(String(currentPage));
                    setEditingPage(true);
                  }}
                  className="group block w-full hover:bg-bg-mid/40 rounded-sm py-0.5 transition"
                  title="Sahifa raqamiga o'tish"
                >
                  <div className="font-serif text-gold text-base sm:text-lg tabular-nums leading-tight">
                    {currentPage}
                    <span className="text-gold/50 mx-1">/</span>
                    {totalPages}
                  </div>
                  <div className="text-cream-soft/50 text-[9px] tracking-[2px] uppercase group-hover:text-gold transition">
                    bosing
                  </div>
                </button>
              )}
            </div>

            <NavButton
              onClick={() => flipRef.current?.pageFlip()?.flipNext()}
              disabled={currentPage >= totalPages}
              label="Keyingi sahifa"
              primary
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </NavButton>

            <NavButton
              onClick={() => jumpToPage(currentPage + JUMP_STEP)}
              disabled={currentPage >= totalPages}
              label="+10 sahifa"
              badge="+10"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </NavButton>

            <NavButton
              onClick={() => jumpToPage(totalPages)}
              disabled={currentPage >= totalPages}
              label="Oxirgi sahifa"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path d="M5 18l7-6-7-6M12 18l7-6-7-6" />
              </svg>
            </NavButton>
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
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

function NavButton({ onClick, disabled, label, badge, primary, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`relative rounded-full transition flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed ${
        primary
          ? 'w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 border border-gold text-gold hover:bg-gold hover:text-bg-deep shadow-[0_0_15px_rgba(212,165,116,0.2)]'
          : 'w-9 h-9 sm:w-10 sm:h-10 border border-gold/40 text-gold/70 hover:text-gold hover:border-gold'
      }`}
    >
      {children}
      {badge && (
        <span className="absolute -top-1 -right-1 px-1 py-[1px] text-[8px] font-serif bg-bg-deep text-gold/80 border border-gold/40 rounded-sm tabular-nums">
          {badge}
        </span>
      )}
    </button>
  );
}
