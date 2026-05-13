import { forwardRef, useEffect, useRef, useState } from 'react';
import { renderPage } from '../../utils/pdf.js';

/**
 * A single PDF page rendered to canvas. Lazy: only renders when `visible` is true.
 * Wrapped in forwardRef so react-pageflip can attach refs.
 *
 * The canvas is rendered at a high resolution and styled with object-fit so it
 * fits whatever size the parent flipbook slot provides.
 */
const PdfPage = forwardRef(function PdfPage(
  { pdfDoc, pageNum, totalPages, visible = true, accent = '#d4a574' },
  ref,
) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error

  useEffect(() => {
    if (!visible || !pdfDoc || !pageNum) return;
    let cancelled = false;
    setStatus('loading');
    renderPage(pdfDoc, pageNum)
      .then((canvas) => {
        if (cancelled) return;
        const host = hostRef.current;
        if (!host) return;
        // Replace any previous canvas
        host.innerHTML = '';
        host.appendChild(canvas);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageNum, visible]);

  return (
    <div
      ref={ref}
      className="relative bg-cream-soft text-bg-deep overflow-hidden"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Canvas mount — flex centers the canvas in the page slot */}
      <div
        ref={hostRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ padding: '8px' }}
      />

      {/* Loading skeleton */}
      {status !== 'ready' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-cream-soft">
          <div className="w-10 h-10 mb-3 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="font-serif italic text-bg-deep/60 text-sm">
            {status === 'error' ? "Sahifani ko'rsatib bo'lmadi" : 'Sahifa yuklanmoqda...'}
          </p>
          <p className="font-serif text-bg-deep/40 text-xs mt-2">
            {pageNum} / {totalPages}
          </p>
        </div>
      )}

      {/* Page number footer (small, on top of canvas) */}
      <div className="absolute bottom-1 left-0 right-0 text-center pointer-events-none">
        <span
          className="inline-block px-2 py-0.5 text-[10px] tracking-[3px] uppercase font-serif bg-cream-soft/80 rounded"
          style={{ color: accent }}
        >
          — {pageNum} —
        </span>
      </div>
    </div>
  );
});

export default PdfPage;
